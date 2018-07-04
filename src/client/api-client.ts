import {Utils} from "../utils/utils";
import {ApiResult} from "./data-client";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs-compat";
import {ClientMediator, RequestStartedEventArgs} from "./client-mediator.service";

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
                protected _http: HttpClient,
                protected _mediator: ClientMediator) {
    }

    get(path: string = '', data?: any, notificationText: string = 'Loading...'): Observable<any> {
        let queryString = ApiClient.getQueryString(data);
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted(notificationText))
            .switchMap(_ => this._http.get<any>(`${this._baseUrl}/${path}${queryString}`, ApiClient._defaultOptions)
                .map(json => ApiClient._unwrapJson(json))
                .do(_ => {
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throwError(err);
                })
            );
    }

    post(path: string = '', data?: any, notificationText: string = 'Loading...'): Observable<any> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted(notificationText))
            .switchMap(_ => this._http.post<any>(`${this._baseUrl}/${path}`, data, ApiClient._defaultOptions)
                .map(json => ApiClient._unwrapJson(json))
                .do(_ => {
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throwError(err);
                })
            );
    }

    patch(path: string = '', data?: any, notificationText: string = 'Loading...'): Observable<any> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted(notificationText))
            .switchMap(_ => this._http.patch<any>(`${this._baseUrl}/${path}`, data, ApiClient._defaultOptions)
                .map(json => ApiClient._unwrapJson(json))
                .do(_ => {
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throwError(err);
                })
            );
    }

    put(path: string = '', data?: any, notificationText: string = 'Loading...'): Observable<any> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted(notificationText))
            .switchMap(_ => this._http.put<any>(`${this._baseUrl}/${path}`, data, ApiClient._defaultOptions)
                .map(json => ApiClient._unwrapJson(json))
                .do(_ => {
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throwError(err);
                })
            );
    }

    delete(path: string = '', notificationText: string = 'Removing...'): Observable<any> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted(notificationText))
            .switchMap(_ => this._http.delete<any>(`${this._baseUrl}/${path}`, ApiClient._defaultOptions)
                .map(json => ApiClient._unwrapJson(json))
                .do(_ => {
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throwError(err);
                })
            );
    }

    private static _unwrapJson(json: ApiResult) {
        if (json.status == "Failure")
            throw json.payload;
        return json.payload;
    }
}
