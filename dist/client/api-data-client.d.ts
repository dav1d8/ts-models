import { DataClient } from "./data-client";
import { ApiClient } from "./api-client";
import { Model } from "../model";
import { PagedResult } from "../pagination";
import { HttpClient } from "@angular/common/http";
import { ClientMediator } from "./client-mediator.service";
import { Observable } from "rxjs-compat";
export declare class ApiDataClient<T extends Model> extends ApiClient implements DataClient<T> {
    protected _baseUrl: string;
    protected _http: HttpClient;
    protected _mediator: ClientMediator;
    constructor(_baseUrl: string, _http: HttpClient, _mediator: ClientMediator);
    getById(id: number): Observable<T>;
    getOne(filter?: any): Observable<T>;
    getMany(filter?: any): Observable<T[]>;
    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>>;
    save(entity: T): Observable<T>;
    saveMany(list: T[]): Observable<T[]>;
    remove(id: number): Observable<boolean>;
    private _insert;
    private _update;
    private _saveInternal;
}
