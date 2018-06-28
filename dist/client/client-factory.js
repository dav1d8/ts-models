"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var store_service_1 = require("../store/store.service");
var model_client_service_1 = require("./model-client.service");
var client_mediator_service_1 = require("./client-mediator.service");
function factoryMethod(modelClass, endpoint) {
    return function (_http, _mediator, _store) { return new model_client_service_1.ModelClient(modelClass, endpoint, _http, _store, _mediator); };
}
function clientFactory(token, modelClass, endpoint) {
    return {
        provide: token,
        useFactory: factoryMethod(modelClass, endpoint),
        deps: [http_1.HttpClient, client_mediator_service_1.ClientMediator, store_service_1.Store]
    };
}
exports.clientFactory = clientFactory;
//# sourceMappingURL=client-factory.js.map