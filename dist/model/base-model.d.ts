import { ObservedModel } from "../utils/model-observable";
import { Observable } from "rxjs/Rx";
export interface ModelSchema {
    __id: string;
    __modelName: string;
}
export interface ModelType extends Function {
    schema: ModelSchema;
}
export declare abstract class Model {
    protected __data: any;
    static readonly schema: ModelSchema;
    static getRefKeys(modelType: ModelType): Array<string>;
    static flat(obj: any, refKeys: Array<string>): any;
    constructor(__data?: any);
    private __subject;
    readonly _$: Observable<ObservedModel>;
    readonly _modelType: ModelType;
    readonly _modelName: string;
    readonly _data: any;
    private __snapshot;
    readonly id: any;
    private __objectId;
    readonly _objectId: string;
    readonly _isNew: boolean;
    _clone<T extends Model>(): T;
    _flatten(): any;
    _takeSnapshot(): void;
    _revert(): void;
    _getPatch(): Array<{
        op: string;
        path: string;
        value: any;
    }>;
    protected _get(name: string): any;
    protected _set(name: string, value: any): any;
    /**
     * Generates all the Observable properties of the Model object that has been decorated with the
     * Calculated decorator. Should be called as the last call in the object's constructor.
     */
    _addCalculatedFields(): void;
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
    protected _calculatedObservable(config: string, fn: () => any): Observable<{}>;
}
export declare class List<T> extends Array<T> {
    constructor(initial?: T[]);
    add(item: T): void;
    addRange(range: T[]): void;
    remove(item: T): void;
    clear(): void;
}
