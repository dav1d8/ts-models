import {Observable} from "rxjs-compat";
import {Model, ModelType} from "../model/base-model";
import {Store} from "../store";
import {PagedResult} from "../pagination";
import {ApiDataClient} from "./api-data-client";
import {HttpClient} from "@angular/common/http";
import {ClientMediator} from "./client-mediator.service";

export class ModelClient<T extends Model> extends ApiDataClient<T> {

    constructor(public modelType: ModelType,
                protected _baseUrl: string,
                protected _http: HttpClient,
                protected _store: Store,
                protected _mediator: ClientMediator) {
        super(_baseUrl, _http, _mediator);
    }

    getById(id: number): Observable<T> {
        return super.getById(id)
            .map(this.map)
            .share();
    }

    getOne(filter?: any): Observable<T> {
        return super.getOne()
            .map(this.map)
            .share();
    }

    getMany(filter?: any): Observable<T[]> {
        return super.getMany(filter)
            .map(this.mapMany)
            .share();
    }

    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>> {
        return super.getPaged(pageIndex, pageSize, filter)
            .map(this.mapPaged)
            .share();
    }

    save(entity: T): Observable<T> {
        return super.save(entity)
            .map(this.mapRef(entity))
            .share();
    }

    saveMany(list: T[]): Observable<T[]> {
        return super.saveMany(list)
            .map(this.mapManyRef(list))
            .share();
    }

    remove(id: number): Observable<boolean> {
        return super.remove(id)
            .do(result => {
                if (result)
                    this._store.remove(id, this.modelType.schema.__modelName);
                else // TODO notify user
                    throw "Entity cannot be deleted";
            })
            .share();
    }

    protected map = (e: T) => this._store.add<T>(e, this.modelType.schema.__modelName);

    protected mapRef(modelRef?: T) {
        return (e: T) => this._store.add<T>(e, this.modelType.schema.__modelName, modelRef)
    };

    protected mapMany = (json: any) => this._store.addMany<T>(json.$values || json, this.modelType.schema.__modelName);

    protected mapManyRef(list: T[]) {
        return (p: T[]) => p.map((c, idx) => this._store.add(c, this.modelType.schema.__modelName, list[idx]))
    }

    protected mapPaged =
        (json: any) => {
            return {
                total: json.total,
                pageIndex: json.pageIndex,
                pageSize: json.pageSize,
                items: this._store.addMany<T>(json.items.$values || json.items, this.modelType.schema.__modelName)
            }
        }
}