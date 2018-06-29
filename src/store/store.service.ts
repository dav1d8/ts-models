import {Injectable} from '@angular/core';
import {Model} from "../model";
import {register, remove, process, StoreRegistration, processMany} from "./store";

@Injectable()
export class Store {

    add<T extends Model>(json: any, type: any, existingRef?: T): T {
        return process<T>(json, type, existingRef);
    }

    addMany<T extends Model>(json: any[], type: any, existingRef?: T[]): T[] {
        return processMany<T>(json, type, existingRef);
    }

    remove(id: number | string, modelName: string): void {
        remove(id, modelName);
    }

    registerModel(...params: Array<StoreRegistration>): void {
        register(params);
    }
}