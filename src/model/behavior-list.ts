import {Model} from "./base-model";
import {Subscription} from "rxjs-compat";
import {ConfigNode, ModelObservable, ObservedModel} from "../utils/model-observable";
import {Subject} from "rxjs/Subject";
import * as _ from 'lodash';

/**
 * Observable version of List<T>, should be integrated with the ModelObservable class.
 * Fires an event on its subject when an item gets added, removed or the list gets cleared.
 * Additionally it can be configured to listen to the changes of the contained elements with the use of ConfigNode.
 */
export class BehaviorList<T extends Model> extends Array<T> {
    _subject: Subject<ObservedModel>;
    subscriptions: Subscription[];
    subscriptionBehaviour?: ConfigNode[];

    constructor(initial: T[] = []) {
        super();
        // https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
        // HACK: Set the prototype explicitly.
        Object.setPrototypeOf(this, BehaviorList.prototype);
        this._subject = new Subject();
        this.subscriptions = [];
        this.addRange(initial);
    }

    add(item: T) {
        this.push(item);
    }

    push(...items: T[]): number {
        let retNum = super.push(...items);
        items.forEach(value => {
            if (!_.isUndefined(this.subscriptionBehaviour)) {
                this.subscriptions.push(ModelObservable.generate(value, this.subscriptionBehaviour)
                    .subscribe((om) => {
                        this._subject.next(om)
                    }));
            }
        });
        this._subject.next(<ObservedModel>{path: '', model: items, action: 'add'});
        return retNum;
    }

    addRange(range: T[]) {
        for (let i of range) {
            this.add(i);
        }
    }

    remove(item: T) {
        let idx = this.indexOf(item);
        if (idx > -1) {
            if (this.subscriptions.length) {
                this.subscriptions[idx].unsubscribe();
                this.subscriptions.splice(idx, 1);
            }
            this.splice(idx, 1);
            this._subject.next(<ObservedModel>{path: '', model: item, action: 'remove'});
        }
    }

    clear() {
        this.clearSubscriptions();
        this.splice(0, this.length);
        this._subject.next(<ObservedModel>{path: '', model: null, action: 'clear'});
    }

    clearSubscriptions() {
        if (this.subscriptions.length) {
            this.subscriptions.forEach(value => value.unsubscribe());
            this.subscriptions.splice(0, this.subscriptions.length);
        }
    }

    /**
     * For using detection in the elements, a ConfigNode must be provided.
     * For every element in a list a Subscription is created which does not affect the element itself.
     * Multiple calls of this function will only preserve the subscriptions of the last one.
     * @param {ConfigNode} configArray
     */
    setSubscriptionConfig(configArray: ConfigNode[]) {
        this.subscriptionBehaviour = configArray;
        this.clearSubscriptions();
        for (let value of this) {
            this.subscriptions.push(ModelObservable.generate(value, this.subscriptionBehaviour)
                .subscribe((om) => {
                    this._subject.next(om)
                }));
        }
    }
}