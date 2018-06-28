import { Observable } from "rxjs";
import { Model } from "../model/base-model";
import { Store } from "../store/store.service";
import { PagedResult } from "../pagination/paged-result";
import { ApiDataClient } from "./api-data-client";
import { HttpClient } from "@angular/common/http";
import { ClientMediator } from "./client-mediator.service";
export declare class ModelClient<T extends Model> extends ApiDataClient<T> {
    typeConstructor: any;
    protected _baseUrl: string;
    protected _http: HttpClient;
    protected _store: Store;
    protected _mediator: ClientMediator;
    constructor(typeConstructor: any, _baseUrl: string, _http: HttpClient, _store: Store, _mediator: ClientMediator);
    getById(id: number): Observable<T>;
    getOne(filter?: any): Observable<T>;
    getMany(filter?: any): Observable<T[]>;
    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>>;
    save(entity: T): Observable<T>;
    saveMany(list: T[]): Observable<T[]>;
    remove(id: number): Observable<boolean>;
}
