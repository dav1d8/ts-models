import { Model, ModelType } from "../model/base-model";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
export declare class ModelMap {
    private _map;
    private _mapSubjects;
    init(): void;
    add(model: Model): void;
    remove(model: Model): void;
    remove(modelName: string, id: number | string): void;
    getTypeSlice(modelType: ModelType): Slice<Model>;
    getTypeSlice(modelName: string): Slice<Model>;
    get(modelType: ModelType, id: number | string): Model | undefined;
    get(modelName: string, id: number | string): Model | undefined;
}
export declare const modelMap: ModelMap;
export interface Slice<TModel extends Model> {
    map: Map<TModel>;
    source: BehaviorSubject<TModel[]>;
}
export declare type Map<TValue> = {
    [key: string]: TValue;
};
