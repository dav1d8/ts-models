import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs-compat";
import { ClientMediator } from "./client-mediator.service";
export declare class ApiClient {
    protected _baseUrl: string;
    protected _http: HttpClient;
    protected _mediator: ClientMediator;
    protected static getQueryString(filter: any): string;
    private static readonly _defaultHeaders;
    private static readonly _defaultOptions;
    readonly baseUrl: string;
    constructor(_baseUrl: string, _http: HttpClient, _mediator: ClientMediator);
    get(path?: string, data?: any, notificationText?: string): Observable<any>;
    post(path?: string, data?: any, notificationText?: string): Observable<any>;
    patch(path?: string, data?: any, notificationText?: string): Observable<any>;
    put(path?: string, data?: any, notificationText?: string): Observable<any>;
    delete(path?: string, notificationText?: string): Observable<any>;
    private static _unwrapJson;
}
