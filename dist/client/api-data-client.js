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
var api_client_1 = require("./api-client");
var Rx_1 = require("rxjs/Rx");
var check_1 = require("../utils/check");
var ApiDataClient = /** @class */ (function (_super) {
    __extends(ApiDataClient, _super);
    function ApiDataClient(_baseUrl, _http, _mediator) {
        var _this = _super.call(this, _baseUrl, _http) || this;
        _this._baseUrl = _baseUrl;
        _this._http = _http;
        _this._mediator = _mediator;
        _this._insert = function (prepared) { return _this.put('', prepared); };
        _this._update = function (id, patch) { return _this.patch("" + id, patch); };
        return _this;
    }
    ApiDataClient.prototype.getById = function (id) {
        var _this = this;
        var reqStarted;
        return Rx_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted('Loading...'); })
            .switchMap(function (_) { return _this.get("" + id)
            .do(function (payload) {
            if (payload instanceof Array || payload.$values) {
                throw "Result must be a single object or empty";
            }
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return Rx_1.Observable.throw(err);
        }); });
    };
    ApiDataClient.prototype.getOne = function (filter) {
        var _this = this;
        var reqStarted;
        return Rx_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted('Loading...'); })
            .switchMap(function (_) { return _this.get('', filter)
            .do(function (payload) {
            if (payload instanceof Array || payload.$values) {
                throw "Result must be a single object or empty";
            }
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return Rx_1.Observable.throw(err);
        }); });
    };
    ApiDataClient.prototype.getMany = function (filter) {
        var _this = this;
        var reqStarted;
        return Rx_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted('Loading...'); })
            .switchMap(function (_) { return _this.get("many", filter)
            .do(function (payload) {
            if (!(payload instanceof Array || payload.$values))
                throw "Result must be an array";
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return Rx_1.Observable.throw(err);
        }); });
    };
    ApiDataClient.prototype.getPaged = function (pageIndex, pageSize, filter) {
        var _this = this;
        check_1.Check.notNull(pageIndex, "pageIndex");
        check_1.Check.notNull(pageSize, "pageSize");
        var reqStarted;
        return Rx_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted('Loading...'); })
            .switchMap(function (_) { return _this.get("paged", Object.assign(filter || {}, { pageIndex: pageIndex, pageSize: pageSize }))
            .do(function (payload) {
            if (!(payload.items instanceof Array || payload.items.$values))
                throw "Result must be an array";
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return Rx_1.Observable.throw(err);
        }); });
    };
    ApiDataClient.prototype.save = function (entity) {
        var _this = this;
        var reqStarted;
        return Rx_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted('Saving...'); })
            .switchMap(function (_) { return _this._saveInternal(entity)
            .do(function (_) {
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return Rx_1.Observable.throw(err);
        }); });
    };
    ApiDataClient.prototype.saveMany = function (list) {
        var _this = this;
        var reqList = list.reduce(function (concatArray, currentEntity) {
            concatArray.push(_this.save(currentEntity));
            return concatArray;
        }, []);
        return Rx_1.Observable.forkJoin(reqList).first();
    };
    ApiDataClient.prototype.remove = function (id) {
        var _this = this;
        var reqStarted;
        return Rx_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted('Removing...'); })
            .switchMap(function (_) { return _this.delete("" + id)
            .do(function (_) {
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return Rx_1.Observable.throw(err);
        }); });
    };
    ApiDataClient.prototype._saveInternal = function (entity) {
        if (entity._isNew)
            return this._insert(entity._flatten());
        var patch = entity._getPatch();
        // if it has ConcurrencyToken we have to add to the patch
        // op: 'test' would be better but that isn't supported at server side
        if (entity['concurrencyStamp'])
            patch.push({ op: 'replace', path: '/concurrencyStamp', value: entity['concurrencyStamp'] });
        // TODO prevent the request when there is no patch
        // if(!patch.length)
        //     return Observable.empty().share();
        return this._update(entity.id, patch);
    };
    return ApiDataClient;
}(api_client_1.ApiClient));
exports.ApiDataClient = ApiDataClient;
//# sourceMappingURL=api-data-client.js.map