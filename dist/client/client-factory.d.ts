import { HttpClient } from "@angular/common/http";
import { Model, ModelType } from "../model/base-model";
import { Store } from "../store/store.service";
import { ModelClient } from "./model-client.service";
import { ClientMediator } from "./client-mediator.service";
export declare function clientFactory<TModel extends Model>(token: any, modelClass: ModelType, endpoint: string): {
    provide: any;
    useFactory: (_http: HttpClient, _mediator: ClientMediator, _store: Store) => ModelClient<TModel>;
    deps: (typeof ClientMediator | typeof Store | typeof HttpClient)[];
};
