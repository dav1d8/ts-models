import {HttpClient} from "@angular/common/http";
import {Model, ModelType} from "../model/base-model";
import {Store} from "../store/store.service";
import {ModelClient} from "./model-client.service";
import {ClientMediator} from "./client-mediator.service";

function factoryMethod<TModel extends Model>(modelClass: ModelType, endpoint: string) {
    return (_http: HttpClient,
            _mediator: ClientMediator,
            _store: Store) => new ModelClient<TModel>(modelClass, endpoint, _http, _store, _mediator);
}

export function adapterFactory<TModel extends Model>(token: any, modelClass: ModelType, endpoint: string) {
    return {
        provide: token,
        useFactory: factoryMethod<TModel>(modelClass, endpoint),
        deps: [HttpClient, ClientMediator, Store]
    }
}