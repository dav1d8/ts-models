import { Model } from "../model";
import { StoreRegistration } from "./store";
export declare class Store {
    add<T extends Model>(json: any, type: any, existingRef?: T): T;
    addMany<T extends Model>(json: any[], type: any, existingRef?: T[]): T[];
    remove(id: number | string, modelName: string): void;
    registerModel(...params: Array<StoreRegistration>): void;
}
