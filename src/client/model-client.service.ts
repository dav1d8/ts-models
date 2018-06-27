import {Observable} from "rxjs";
import {Model} from "../model/base-model";
import {Store} from "../store/store.service";
import {PagedResult} from "../pagination/paged-result";
import {ApiDataClient} from "./api-data-client";
import {HttpClient} from "@angular/common/http";
import {ClientMediator} from "./client-mediator.service";

export class ModelClient<T extends Model> extends ApiDataClient<T> {
    constructor(public typeConstructor: any,
                protected _baseUrl: string,
                protected _http: HttpClient,
                protected _store: Store,
                protected _mediator: ClientMediator) {
        super(typeConstructor, _baseUrl, _http, _mediator);
    }

    getById(id: number): Observable<T> {
        return super.getById(id)
            .map(e => this._store.add<T>(e, this.typeConstructor.schema.__modelName))
            .share();
    }

    getOne(filter?: any): Observable<T> {
        return super.getOne()
            .map(e => this._store.add<T>(e, this.typeConstructor.schema.__modelName))
            .share();
    }

    getMany(filter?: any): Observable<T[]> {
        return super.getMany(filter)
            .map(json => this._store.addMany<T>((<any>json).$values || json, this.typeConstructor.schema.__modelName))
            .share();
    }

    getPaged(pageIndex: number, pageSize: number, filter?: any): Observable<PagedResult<T>> {
        return super.getPaged(pageIndex, pageSize, filter)
            .map((json) => {
                return {
                    total: json.total,
                    pageIndex: json.pageIndex,
                    pageSize: json.pageSize,
                    items: this._store.addMany<T>((<any>json.items).$values || json.items, this.typeConstructor.schema.__modelName)
                }
            })
            .share();
    }

    save(entity: T): Observable<T> {
        return super.save(entity)
            .map(p => this._store.add(p, this.typeConstructor.schema.__modelName, entity))
            .share();
    }

    saveMany(list: T[]): Observable<T[]> {
        return super.saveMany(list)
            .map(p => p.map((c, idx) => this._store.add(c, this.typeConstructor.schema.__modelName, list[idx])))
            .share();
    }

    remove(id: number): Observable<boolean> {
        return super.remove(id)
            .do(result => {
                if (result)
                    this._store.remove(id, this.typeConstructor.schema.__modelName);
                else // TODO notify user
                    throw "Entity cannot be deleted";
            })
            .share();
    }
}