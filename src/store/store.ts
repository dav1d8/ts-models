import {Model, ModelType} from "../model/base-model";
import {modelMap} from "./model-map";
import {InjectionToken, Type, TypeProvider} from "@angular/core";
import {Obj} from "../utils/obj";
import {BehaviorList} from "../model/behavior-list";
import {Check} from "../utils/check";

export interface StoreRegistration {
    entityType: ModelType,
    adapter?: TypeProvider | InjectionToken<any>
}

export let modelTypeMap: { [key: string]: ModelType } = {};
export let modelAdapterMap: { [key: string]: TypeProvider | InjectionToken<any> | undefined } = {};

export function initStore() {
    modelMap.init();
    modelTypeMap = {};
}


export function register(modelArray: Array<StoreRegistration>): void;
export function register(modelArray: Array<ModelType>): void;
export function register(modelArray: Array<any>): void {
    for (let entry of modelArray) {
        if (entry.entityType) { // instance of StoreRegistration
            modelTypeMap[entry.entityType.schema.__modelName] = entry.entityType;
            modelAdapterMap[entry.entityType.schema.__modelName] = entry.adapter;
        }
        else { // instance of ModelType
            modelTypeMap[entry.schema.__modelName] = entry;
            modelAdapterMap[entry.schema.__modelName] = undefined;
        }
    }
}

export function remove(id: number | string, modelName: string) {
    modelMap.remove(modelName, id);
}

export function process<TModel extends Model>(json: any, rootModelName: string, existingRef?: TModel): TModel {
    let workingObj = Object.assign({}, json);
    let processCache = {};
    return processInternal(workingObj, rootModelName, processCache, existingRef);
}

export function processMany<TModel extends Model>(json: any[], rootModelName: string, existingRef: TModel[] = []): TModel[] {
    let workingObj = Object.assign([], json);
    let processCache = {};
    return workingObj.reduce((prev, curr, currIdx) => {
        let model = processInternal(curr, rootModelName, processCache, existingRef[currIdx]);
        return prev.concat(model)
    }, [] as TModel[]);
}

function processInternal<TModel extends Model>(json: any, modelType: ModelType, processCache: { [key: number]: Model }, existingRef?: TModel): TModel;
function processInternal<TModel extends Model>(json: any, modelName: string, processCache: { [key: number]: Model }, existingRef?: TModel): TModel;
function processInternal<TModel extends Model>(json: any, modelParam: any, processCache: { [key: number]: Model }, existingRef?: TModel): TModel {
    Check.notNull(json, 'json');

    let modelType = modelParam;
    if (Obj.isString(modelParam))
        modelType = modelTypeMap[modelParam];

    let model: TModel = existingRef || modelMap.get(modelType, json[modelType.schema.__id]) || new (<any>modelType)();
    // Check.NotNull(json.$id, '$id');
    if (json.$id) { // if reference handling is enabled
        if (!processCache[json.$id])
            processCache[json.$id] = model;
        else {
            Object.assign(processCache[json.$id]._data, json);
            delete processCache[json.$id]._data['$id'];
        }
    }

    if (!json.$ref) {
        Object.keys(json).forEach(propName => {

            if (!Obj.isObj(json[propName]) || json[propName] == null) {
                // simple prop or null
                model._data[propName] = json[propName];
            } else {
                // array
                if (Array.isArray(json[propName]) || json[propName].$values) {
                    if (!modelType.schema[propName]) {
                        let subscriptionBehaviour;
                        if (model._data[propName] && model._data[propName]['subscriptionBehaviour']) {
                            <BehaviorList<Model>>(model._data[propName]).clear();
                            subscriptionBehaviour = model._data[propName]['subscriptionBehaviour'];
                        }

                        model._data[propName] = new BehaviorList(json[propName]);

                        if (subscriptionBehaviour) {
                            <BehaviorList<Model>>(model._data[propName]).setSubscriptionConfig(subscriptionBehaviour);
                        }
                    }
                    else {
                        let modelList = new BehaviorList();
                        if (model._data[propName]) {
                            <BehaviorList<Model>>(model._data[propName]).clear();
                            modelList = model._data[propName];
                        }
                        for (let obj of json[propName]) {
                            modelList.add(processInternal(obj, modelType.schema[propName].model, processCache));
                        }
                        model._data[propName] = modelList;
                    }
                }
                // json reference
                else if (json[propName].$ref) {
                    let navProp = processCache[json[propName].$ref] || new (<any>modelType.schema[propName].model)();
                    processCache[json[propName].$ref] = navProp;
                    model._data[propName] = navProp;
                }
                // complex object
                else {
                    if (!modelType.schema[propName])
                        model._data[propName] = json[propName];
                    else
                        model._data[propName] = processInternal(json[propName], modelType.schema[propName].model, processCache);
                }
            }
        });
    }
    else {
        model = <TModel>processCache[json.$ref] || new (<any>modelType)();
        processCache[json.$ref] = model;
        return model;
    }

    model._takeSnapshot();
    modelMap.add(model);
    return model;
}










