import {Utils} from "../utils/utils";
import {ApiResult} from "./data-client";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs-compat";

export class ApiClient {
    protected static getQueryString(filter: any): string {
        return filter ? `?${Utils.serialize(filter)}` : '';
    }

    private static readonly _defaultHeaders = new HttpHeaders(
        {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    );
    private static readonly _defaultOptions = {headers: ApiClient._defaultHeaders};

    public get baseUrl(): string {
        return this._baseUrl;
    }

    constructor(protected _baseUrl: string,
                protected _http: HttpClient) {
    }

    get(path: string = '', data?: any): Observable<any> {
        let queryString = ApiClient.getQueryString(data);
        return this._http
            .get<any>(`${this._baseUrl}/${path}${queryString}`, ApiClient._defaultOptions)
            .map(json => ApiClient._unwrapJson(json));
    }

    post(path: string = '', data?: any): Observable<any> {
        return this._http
            .post<any>(`${this._baseUrl}/${path}`, data, ApiClient._defaultOptions)
            .map(json => ApiClient._unwrapJson(json));
    }

    patch(path: string = '', data?: any): Observable<any> {
        return this._http
            .patch<any>(`${this._baseUrl}/${path}`, data, ApiClient._defaultOptions)
            .map(json => ApiClient._unwrapJson(json));
    }

    put(path: string = '', data?: any): Observable<any> {
        return this._http
            .put<any>(`${this._baseUrl}/${path}`, data, ApiClient._defaultOptions)
            .map(json => ApiClient._unwrapJson(json));
    }

    delete(path: string = ''): Observable<any> {
        return this._http
            .delete<any>(`${this._baseUrl}/${path}`, ApiClient._defaultOptions)
            .map(json => ApiClient._unwrapJson(json));
    }

    private static _unwrapJson(json: ApiResult) {
        if (json.status == "Failure")
            throw json.payload;
        return json.payload;
    }
}
