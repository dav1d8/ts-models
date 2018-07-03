import { Observable } from "rxjs-compat";
import { Model, ModelType } from "../model/base-model";
import { Store } from "../store";
import { PagedResult } from "../pagination";
import { ApiDataClient } from "./api-data-client";
import { HttpClient } from "@angular/common/http";
import { ClientMediator } from "./client-mediator.service";
export declare class ModelClient<T extends Model> extends ApiDataClient<T> {
    modelType: ModelType;
    protected _baseUrl: string;
    protected _http: HttpClient;
    protected _store: Store;
    protected _mediator: ClientMediator;
    constructor(modelType: ModelType, _baseUrl: string, _http: HttpClient, _store: Store, _mediator: ClientMediator);
    getById(id: number): Observable<T>;
    getOne(filter?: any): Observable<T>;
    getMany(filter?: any): Observable<T[]>;
    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>>;
    save(entity: T): Observable<T>;
    saveMany(list: T[]): Observable<T[]>;
    remove(id: number): Observable<boolean>;
    protected map: (e: T) => T;
    protected mapRef(modelRef?: T): (e: T) => T;
    protected mapMany: (json: any) => T[];
    protected mapManyRef(list: T[]): (p: T[]) => T[];
    protected mapPaged: (json: any) => {
        total: any;
        pageIndex: any;
        pageSize: any;
        items: T[];
    };
}
