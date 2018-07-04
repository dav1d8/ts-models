import {DataClient} from "./data-client";
import {ApiClient} from "./api-client";
import {Model} from "../model";
import {Check} from "../utils/check";
import {PagedResult} from "../pagination";
import {HttpClient} from "@angular/common/http";
import {ClientMediator} from "./client-mediator.service";
import {Observable} from "rxjs-compat";

export class ApiDataClient<T extends Model> extends ApiClient implements DataClient<T> {

    constructor(protected _baseUrl: string,
                protected _http: HttpClient,
                protected _mediator: ClientMediator) {
        super(_baseUrl, _http, _mediator);
    }

    getById(id: number): Observable<T> {
        return this.get(`${id}`)
            .do(payload => {
                if (payload instanceof Array || payload.$values) {
                    throw "Result must be a single object or empty";
                }
            });
    }

    getOne(filter?: any): Observable<T> {
        return this.get('', filter)
            .do(payload => {
                if (payload instanceof Array || payload.$values) {
                    throw "Result must be a single object or empty";
                }
            });
    }

    getMany(filter?: any): Observable<T[]> {
        return this.get("many", filter)
            .do(payload => {
                if (!(payload instanceof Array || payload.$values)) {
                    throw "Result must be an array";
                }
            });
    }

    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>> {
        Check.notNull(pageIndex, "pageIndex");
        Check.notNull(pageSize, "pageSize");

        return this.get("paged", Object.assign(filter || {}, {pageIndex, pageSize}))
            .do((payload: PagedResult<any>) => {
                if (!(payload.items instanceof Array || (<any>payload.items).$values)) {
                    throw "Result must be an array";
                }
            });
    }

    save(entity: T): Observable<T> {
        return this._saveInternal(entity);
    }

    saveMany(list: T[]): Observable<T[]> {

        let reqList = list.reduce((concatArray, currentEntity) => {
            concatArray.push(this.save(currentEntity));
            return concatArray;
        }, [] as Observable<T>[]);

        return Observable.forkJoin(reqList).first();
    }

    remove(id: number): Observable<boolean> {
        return this.delete(`${id}`, 'Removing...');
    }

    private _insert = (prepared: any) => this.put('', prepared, 'Saving...');

    private _update = (id: number, patch: any) => this.patch(`${id}`, patch, 'Saving...');

    private _saveInternal(entity: T): Observable<any> {
        if (entity._isNew)
            return this._insert(entity._flatten());

        let patch = entity._getPatch();
        // if it has ConcurrencyToken we have to add to the patch
        // op: 'test' would be better but that isn't supported at server side
        if (entity['concurrencyStamp'])
            patch.push({op: 'replace', path: '/concurrencyStamp', value: entity['concurrencyStamp']});

        // TODO prevent the request when there is no patch
        // if(!patch.length)
        //     return Observable.empty().share();

        return this._update(entity.id, patch);
    }
}