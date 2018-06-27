import {Observable} from "rxjs";
import {PagedResult} from "../pagination/paged-result";

export interface ApiResult {
    payload: any | { $values: Array<any> };
    status: 'Failure' | 'Success';
}

export interface DataClient<T> {
    typeConstructor: any;
    getById(id: number): Observable<T>;
    getOne(filter?: any): Observable<T>;
    getMany(filter?: any): Observable<T[]>;
    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>>;
    save(entity: T): Observable<T>;
    saveMany(list: T[]): Observable<T[]>;
    remove(id: number): Observable<boolean>;
}