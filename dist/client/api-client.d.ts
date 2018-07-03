import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs-compat";
export declare class ApiClient {
    protected _baseUrl: string;
    protected _http: HttpClient;
    protected static getQueryString(filter: any): string;
    private static readonly _defaultHeaders;
    private static readonly _defaultOptions;
    readonly baseUrl: string;
    constructor(_baseUrl: string, _http: HttpClient);
    get(path?: string, data?: any): Observable<any>;
    post(path?: string, data?: any): Observable<any>;
    patch(path?: string, data?: any): Observable<any>;
    put(path?: string, data?: any): Observable<any>;
    delete(path?: string): Observable<any>;
    private static _unwrapJson;
}
