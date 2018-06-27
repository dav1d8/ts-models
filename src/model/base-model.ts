import {Obj} from "../utils/obj";
import {Utils} from "../utils/utils";
import {RelationType} from "./schema-descriptor";
import {ModelObservable, ObservedModel} from "../utils/model-observable";
import {Subject, Observable} from "rxjs/Rx";
import * as _ from "lodash";

const jsonPatch = require("fast-json-patch");

export interface ModelSchema {
    __id: string;
    __modelName: string;
}

export interface ModelType extends Function {
    schema: ModelSchema;
}

export abstract class Model {
    // default
    static readonly schema: ModelSchema = {
        __id: 'id',
        __modelName: 'BaseModel'
    };

    static getRefKeys(modelType: ModelType): Array<string> {
        return Object.keys(modelType.schema)
            .filter(k => !k.startsWith('__') && modelType.schema[k].type == RelationType.ref);
    }

    static flat(obj: any, refKeys: Array<string>): any {
        let result = {};
        Object.keys(obj).forEach(i => {
            // simple objects: number, string, boolean
            if (!Obj.isObj(obj[i]) && !_.includes(refKeys, i.replace(/Id$/, ''))) {
                result[i] = obj[i];
            }
            // related objects - we need only the id
            if (obj[i] != null && _.includes(refKeys, i)) {
                result[i + 'Id'] = (<Model>obj[i]).id;
            }
        });
        return result;
    }

    constructor(protected __data: any = {}) {
        this._takeSnapshot();
    }

    private __subject = new Subject<ObservedModel>();

    readonly _$: Observable<ObservedModel> = this.__subject.asObservable();

    get _modelType(): ModelType {
        return Object.getPrototypeOf(this).constructor;
    }

    get _modelName(): string {
        return this._modelType.schema.__modelName;
    }

    get _data() {
        return this.__data;
    }

    private __snapshot: any;

    get id() {
        return this._get(this._modelType.schema.__id);
    }

    private __objectId = Utils.generateUUID();

    get _objectId(): string {
        return this.__objectId;
    }

    get _isNew(): boolean {
        return !this.id;
    }

    _clone<T extends Model>(): T {
        return new (<any>this._modelType)(this.__data);
    }

    _flatten() {
        return Model.flat(this.__data, Model.getRefKeys(this._modelType));
    }

    _takeSnapshot() {
        this.__snapshot = Object.assign({}, this.__data);
    }

    _revert() {
        this.__data = this.__snapshot;
    }

    _getPatch(): Array<{ op: string, path: string, value: any }> {
        let flatOriginal = Model.flat(this.__snapshot, Model.getRefKeys(this._modelType));
        return jsonPatch.compare(flatOriginal, this._flatten());
    }

    protected _get(name: string): any {
        return this.__data[name];
    }

    protected _set(name: string, value: any): any {
        let original: any;
        if (_.isObject(this.__data[name])) {
            original = Object.create(this.__data[name]);
        } else {
            original = this.__data[name];
        }
        this.__data[name] = value;
        this.__subject.next(<ObservedModel>{
            path: name,
            model: this,
            action: 'change',
            oldValue: original
        });
    }

    /**
     * Generates all the Observable properties of the Model object that has been decorated with the
     * Calculated decorator. Should be called as the last call in the object's constructor.
     */
    _addCalculatedFields() {
        let reflect = window['Reflect'];
        let calculatedData = reflect.getMetadata('CALCULATED', Object.getPrototypeOf(this).constructor);
        for (let key in calculatedData) {
            this[key] = this._calculatedObservable(calculatedData[key].config, () => this[calculatedData[key].fnName]());
        }
    }

    /**
     * Generates an Observable, which gets new data anytime there is a change in the Model object on the configured
     * fields. Currently used with the Calculated decorator.
     * @param {string} config ConfigNode string, determines the watched properties of the model,
     * refer to ModelObservable for further explanation.
     * @param {() => any} fn Function to call when a change occurs. The functions return value will be then passed to
     * the generated Observable.
     * @returns {Observable<any>} Observable that gets it's next element through the passed function when the Model
     * object changes on properties defined by the ConfigNode
     */
    protected _calculatedObservable(config: string, fn: () => any) {
        return new Observable(observer => {
            let cn = ModelObservable.stringToNode(this._modelName, config, '\n', ' ');
            ModelObservable.generate(this, cn.children, false).subscribe(() => {
                observer.next(fn());
            });
            observer.next(fn());
        }).shareReplay();
    }
}

export class List<T> extends Array<T> {

    constructor(initial: T[] = []) {
        super();
        // https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
        // HACK: Set the prototype explicitly.
        Object.setPrototypeOf(this, List.prototype);
        this.addRange(initial);
    }

    add(item: T) {
        this.push(item);
    }

    addRange(range: T[]) {
        for (let i of range) {
            this.add(i);
        }
    }

    remove(item: T) {
        let idx = this.indexOf(item);
        if (idx > -1)
            this.splice(idx, 1);
    }

    clear() {
        this.splice(0, this.length);
    }
}
