import { DataClient } from "./data-client";
import { ApiClient } from "./api-client";
import { Observable } from "rxjs/Rx";
import { Model } from "../model/base-model";
import { PagedResult } from "../pagination/paged-result";
import { HttpClient } from "@angular/common/http";
import { ClientMediator } from "./client-mediator.service";
export declare class ApiDataClient<T extends Model> extends ApiClient implements DataClient<T> {
    typeConstructor: any;
    protected _baseUrl: string;
    protected _http: HttpClient;
    protected _mediator: ClientMediator;
    constructor(typeConstructor: any, _baseUrl: string, _http: HttpClient, _mediator: ClientMediator);
    getById(id: number): Observable<T>;
    getOne(filter?: any): Observable<T>;
    getMany(filter?: any): Observable<T[]>;
    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>>;
    save(entity: T): Observable<T>;
    saveMany(list: T[]): Observable<T[]>;
    remove(id: number): Observable<boolean>;
    private _insert;
    private _update;
    private _saveInternal(entity);
}
