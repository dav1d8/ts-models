import {DataClient} from "./data-client";
import {ApiClient} from "./api-client";
import {Observable} from "rxjs/Rx";
import {Model} from "../model";
import {Check} from "../utils/check";
import {PagedResult} from "../pagination";
import {HttpClient} from "@angular/common/http";
import {ClientMediator, RequestStartedEventArgs} from "./client-mediator.service";

export class ApiDataClient<T extends Model> extends ApiClient implements DataClient<T> {

    constructor(protected _baseUrl: string,
                protected _http: HttpClient,
                protected _mediator: ClientMediator) {
        super(_baseUrl, _http);
    }

    getById(id: number): Observable<T> {

        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted('Loading...'))
            .switchMap(_ => this.get(`${id}`)
                .do(payload => {
                    if (payload instanceof Array || payload.$values) {
                        throw "Result must be a single object or empty";
                    }
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throw(err);
                })
            );
    }

    getOne(filter?: any): Observable<T> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted('Loading...'))
            .switchMap(_ => this.get('', filter)
                .do(payload => {
                    if (payload instanceof Array || payload.$values) {
                        throw "Result must be a single object or empty";
                    }
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throw(err);
                })
            );
    }

    getMany(filter?: any): Observable<T[]> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted('Loading...'))
            .switchMap(_ => this.get("many", filter)
                .do(payload => {
                    if (!(payload instanceof Array || payload.$values))
                        throw "Result must be an array";
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throw(err);
                }));
    }

    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>> {
        Check.notNull(pageIndex, "pageIndex");
        Check.notNull(pageSize, "pageSize");

        let reqStarted: RequestStartedEventArgs;
        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted('Loading...'))
            .switchMap(_ => this.get("paged", Object.assign(filter || {}, {pageIndex, pageSize}))
                .do((payload: PagedResult<any>) => {
                    if (!(payload.items instanceof Array || (<any>payload.items).$values))
                        throw "Result must be an array";
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throw(err);
                })
            );
    }

    save(entity: T): Observable<T> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted('Saving...'))
            .switchMap(_ => this._saveInternal(entity)
                .do(_ => {
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throw(err);
                })
            );
    }

    saveMany(list: T[]): Observable<T[]> {

        let reqList = list.reduce((concatArray, currentEntity) => {
            concatArray.push(this.save(currentEntity));
            return concatArray;
        }, [] as Observable<T>[]);

        return Observable.forkJoin(reqList).first();
    }

    remove(id: number): Observable<boolean> {
        let reqStarted: RequestStartedEventArgs;

        return Observable.of(0)
            .do(_ => reqStarted = this._mediator.notifyRequestStarted('Removing...'))
            .switchMap(_ => this.delete(`${id}`)
                .do(_ => {
                    reqStarted.success.emit();
                    reqStarted.complete.emit();
                })
                .catch(err => {
                    reqStarted.error.emit(err);
                    reqStarted.complete.emit();
                    return Observable.throw(err);
                })
            );
    }

    private _insert = (prepared: any) => this.put('', prepared);

    private _update = (id: number, patch: any) => this.patch(`${id}`, patch);

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