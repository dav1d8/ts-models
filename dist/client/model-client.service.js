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
    function ModelClient(typeConstructor, _baseUrl, _http, _store, _mediator) {
        var _this = _super.call(this, typeConstructor, _baseUrl, _http, _mediator) || this;
        _this.typeConstructor = typeConstructor;
        _this._baseUrl = _baseUrl;
        _this._http = _http;
        _this._store = _store;
        _this._mediator = _mediator;
        return _this;
    }
    ModelClient.prototype.getById = function (id) {
        var _this = this;
        return _super.prototype.getById.call(this, id)
            .map(function (e) { return _this._store.add(e, _this.typeConstructor.schema.__modelName); })
            .share();
    };
    ModelClient.prototype.getOne = function (filter) {
        var _this = this;
        return _super.prototype.getOne.call(this)
            .map(function (e) { return _this._store.add(e, _this.typeConstructor.schema.__modelName); })
            .share();
    };
    ModelClient.prototype.getMany = function (filter) {
        var _this = this;
        return _super.prototype.getMany.call(this, filter)
            .map(function (json) { return _this._store.addMany(json.$values || json, _this.typeConstructor.schema.__modelName); })
            .share();
    };
    ModelClient.prototype.getPaged = function (pageIndex, pageSize, filter) {
        var _this = this;
        return _super.prototype.getPaged.call(this, pageIndex, pageSize, filter)
            .map(function (json) {
            return {
                total: json.total,
                pageIndex: json.pageIndex,
                pageSize: json.pageSize,
                items: _this._store.addMany(json.items.$values || json.items, _this.typeConstructor.schema.__modelName)
            };
        })
            .share();
    };
    ModelClient.prototype.save = function (entity) {
        var _this = this;
        return _super.prototype.save.call(this, entity)
            .map(function (p) { return _this._store.add(p, _this.typeConstructor.schema.__modelName, entity); })
            .share();
    };
    ModelClient.prototype.saveMany = function (list) {
        var _this = this;
        return _super.prototype.saveMany.call(this, list)
            .map(function (p) { return p.map(function (c, idx) { return _this._store.add(c, _this.typeConstructor.schema.__modelName, list[idx]); }); })
            .share();
    };
    ModelClient.prototype.remove = function (id) {
        var _this = this;
        return _super.prototype.remove.call(this, id)
            .do(function (result) {
            if (result)
                _this._store.remove(id, _this.typeConstructor.schema.__modelName);
            else
                throw "Entity cannot be deleted";
        })
            .share();
    };
    return ModelClient;
}(api_data_client_1.ApiDataClient));
exports.ModelClient = ModelClient;
//# sourceMappingURL=model-client.service.js.map