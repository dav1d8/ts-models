"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var api_data_client_1 = require("./api-data-client");
var ModelClient = /** @class */ (function (_super) {
    __extends(ModelClient, _super);
    function ModelClient(modelType, _baseUrl, _http, _store, _mediator) {
        var _this = _super.call(this, _baseUrl, _http, _mediator) || this;
        _this.modelType = modelType;
        _this._baseUrl = _baseUrl;
        _this._http = _http;
        _this._store = _store;
        _this._mediator = _mediator;
        _this.map = function (e) { return _this._store.add(e, _this.modelType.schema.__modelName); };
        _this.mapMany = function (json) { return _this._store.addMany(json.$values || json, _this.modelType.schema.__modelName); };
        _this.mapPaged = function (json) {
            return {
                total: json.total,
                pageIndex: json.pageIndex,
                pageSize: json.pageSize,
                items: _this._store.addMany(json.items.$values || json.items, _this.modelType.schema.__modelName)
            };
        };
        return _this;
    }
    ModelClient.prototype.getById = function (id) {
        return _super.prototype.getById.call(this, id)
            .map(this.map)
            .share();
    };
    ModelClient.prototype.getOne = function (filter) {
        return _super.prototype.getOne.call(this)
            .map(this.map)
            .share();
    };
    ModelClient.prototype.getMany = function (filter) {
        return _super.prototype.getMany.call(this, filter)
            .map(this.mapMany)
            .share();
    };
    ModelClient.prototype.getPaged = function (pageIndex, pageSize, filter) {
        return _super.prototype.getPaged.call(this, pageIndex, pageSize, filter)
            .map(this.mapPaged)
            .share();
    };
    ModelClient.prototype.save = function (entity) {
        return _super.prototype.save.call(this, entity)
            .map(this.mapRef(entity))
            .share();
    };
    ModelClient.prototype.saveMany = function (list) {
        return _super.prototype.saveMany.call(this, list)
            .map(this.mapManyRef(list))
            .share();
    };
    ModelClient.prototype.remove = function (id) {
        var _this = this;
        return _super.prototype.remove.call(this, id)
            .do(function (result) {
            if (result)
                _this._store.remove(id, _this.modelType.schema.__modelName);
            else // TODO notify user
                throw "Entity cannot be deleted";
        })
            .share();
    };
    ModelClient.prototype.mapRef = function (modelRef) {
        var _this = this;
        return function (e) { return _this._store.add(e, _this.modelType.schema.__modelName, modelRef); };
    };
    ;
    ModelClient.prototype.mapManyRef = function (list) {
        var _this = this;
        return function (p) { return p.map(function (c, idx) { return _this._store.add(c, _this.modelType.schema.__modelName, list[idx]); }); };
    };
    return ModelClient;
}(api_data_client_1.ApiDataClient));
exports.ModelClient = ModelClient;
//# sourceMappingURL=model-client.service.js.map