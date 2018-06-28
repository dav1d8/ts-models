import { Model, ModelType } from "../model/base-model";
import { InjectionToken, TypeProvider } from "@angular/core";
export interface StoreRegistration {
    entityType: ModelType;
    adapter?: TypeProvider | InjectionToken<any>;
}
export declare let modelTypeMap: {
    [key: string]: ModelType;
};
export declare let modelAdapterMap: {
    [key: string]: TypeProvider | InjectionToken<any> | undefined;
};
export declare function initStore(): void;
export declare function register(modelArray: Array<StoreRegistration>): void;
export declare function register(modelArray: Array<ModelType>): void;
export declare function remove(id: number | string, modelName: string): void;
export declare function process<TModel extends Model>(json: any, rootModelName: string, existingRef?: TModel): TModel;
export declare function processMany<TModel extends Model>(json: any[], rootModelName: string, existingRef?: TModel[]): TModel[];
