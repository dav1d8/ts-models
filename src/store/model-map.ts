import {Model, ModelType} from "../model/base-model";
import {Check} from "../utils/check";
import {Obj} from "../utils/obj";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class ModelMap {
    private _map: Map<Map<Model>> = {};
    private _mapSubjects: Map<BehaviorSubject<Model[]>> = {};

    public init() {
        this._map = {};
        this._mapSubjects = {};
    }

    public add(model: Model): void {
        Check.notNull(model, 'model');
        Check.isType(model, Model, 'model');
        Check.notNullOrEmptyString(model.id, 'model.id');

        let slice = this.getTypeSlice(model._modelType);
        slice.map[model.id] = model;
        slice.source.next(Object.keys(slice.map).map(k => slice.map[k]));
    }

    public remove(model: Model): void
    public remove(modelName: string, id: number | string): void;
    public remove(modelParam: any, id?: number | string): void {
        Check.notNull(modelParam, 'modelParam');

        let model: Model | undefined;

        if (modelParam instanceof Model) {
            Check.notNullOrEmptyString(modelParam.id, 'modelParam.id');
            model = modelParam;
        }
        else {
            Check.notNullOrEmptyString(id, 'id');
            if (!(model = this.get(modelParam, id!))) return;
        }

        delete this.getTypeSlice(model._modelType).map[model.id];
    }

    public getTypeSlice(modelType: ModelType): Slice<Model>;
    public getTypeSlice(modelName: string): Slice<Model>;
    public getTypeSlice(modelParam: any): Slice<Model> {

        Check.notNull(modelParam, 'modelParam');
        let modelName = Obj.isString(modelParam) ? modelParam : modelParam.schema.__modelName;

        if (!this._map[modelName]) {
            this._map[modelName] = {};
            this._mapSubjects[modelName] = new BehaviorSubject<Model[]>([]);
        }

        return {
            map: this._map[modelName],
            source: this._mapSubjects[modelName]
        };
    }

    public get(modelType: ModelType, id: number | string): Model | undefined;
    public get(modelName: string, id: number | string): Model | undefined;
    public get(modelParam: any, id: number | string): Model | undefined {
        return this.getTypeSlice(modelParam).map[id];
    }
}

export const modelMap = new ModelMap();

export interface Slice<TModel extends Model> {
    map: Map<TModel>,
    source: BehaviorSubject<TModel[]>;
}

export type Map<TValue> = { [key: string]: TValue }