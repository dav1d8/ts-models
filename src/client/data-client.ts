import {Observable} from "rxjs";
import {PagedResult} from "../pagination/paged-result";
import {ModelType} from "../model/base-model";

export interface ApiResult {
    payload: any | { $values: Array<any> };
    status: 'Failure' | 'Success';
}

export interface DataClient<T> {
    getById(id: number): Observable<T>;
    getOne(filter?: any): Observable<T>;
    getMany(filter?: any): Observable<T[]>;
    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>>;
    save(entity: T): Observable<T>;
    saveMany(list: T[]): Observable<T[]>;
    remove(id: number): Observable<boolean>;
}