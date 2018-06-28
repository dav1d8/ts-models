import { Model } from "./base-model";
import { Subscription } from "rxjs/Subscription";
import { ConfigNode, ObservedModel } from "../utils/model-observable";
import { Subject } from "rxjs/Subject";
/**
 * Observable version of List<T>, should be integrated with the ModelObservable class.
 * Fires an event on its subject when an item gets added, removed or the list gets cleared.
 * Additionally it can be configured to listen to the changes of the contained elements with the use of ConfigNode.
 */
export declare class BehaviorList<T extends Model> extends Array<T> {
    _subject: Subject<ObservedModel>;
    subscriptions: Subscription[];
    subscriptionBehaviour: ConfigNode[];
    constructor(initial?: T[]);
    add(item: T): void;
    push(...items: T[]): number;
    addRange(range: T[]): void;
    remove(item: T): void;
    clear(): void;
    clearSubscriptions(): void;
    /**
     * For using detection in the elements, a ConfigNode must be provided.
     * For every element in a list a Subscription is created which does not affect the element itself.
     * Multiple calls of this function will only preserve the subscriptions of the last one.
     * @param {ConfigNode} configArray
     */
    setSubscriptionConfig(configArray: ConfigNode[]): void;
}
