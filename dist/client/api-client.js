"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var http_1 = require("@angular/common/http");
var rxjs_compat_1 = require("rxjs-compat");
var ApiClient = /** @class */ (function () {
    function ApiClient(_baseUrl, _http, _mediator) {
        this._baseUrl = _baseUrl;
        this._http = _http;
        this._mediator = _mediator;
    }
    ApiClient.getQueryString = function (filter) {
        return filter ? "?" + utils_1.Utils.serialize(filter) : '';
    };
    Object.defineProperty(ApiClient.prototype, "baseUrl", {
        get: function () {
            return this._baseUrl;
        },
        enumerable: true,
        configurable: true
    });
    ApiClient.prototype.get = function (path, data, notificationText) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (notificationText === void 0) { notificationText = 'Loading...'; }
        var queryString = ApiClient.getQueryString(data);
        var reqStarted;
        return rxjs_compat_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted(notificationText); })
            .switchMap(function (_) { return _this._http.get(_this._baseUrl + "/" + path + queryString, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); })
            .do(function (_) {
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return rxjs_compat_1.Observable.throwError(err);
        }); });
    };
    ApiClient.prototype.post = function (path, data, notificationText) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (notificationText === void 0) { notificationText = 'Loading...'; }
        var reqStarted;
        return rxjs_compat_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted(notificationText); })
            .switchMap(function (_) { return _this._http.post(_this._baseUrl + "/" + path, data, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); })
            .do(function (_) {
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return rxjs_compat_1.Observable.throwError(err);
        }); });
    };
    ApiClient.prototype.patch = function (path, data, notificationText) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (notificationText === void 0) { notificationText = 'Loading...'; }
        var reqStarted;
        return rxjs_compat_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted(notificationText); })
            .switchMap(function (_) { return _this._http.patch(_this._baseUrl + "/" + path, data, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); })
            .do(function (_) {
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return rxjs_compat_1.Observable.throwError(err);
        }); });
    };
    ApiClient.prototype.put = function (path, data, notificationText) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (notificationText === void 0) { notificationText = 'Loading...'; }
        var reqStarted;
        return rxjs_compat_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted(notificationText); })
            .switchMap(function (_) { return _this._http.put(_this._baseUrl + "/" + path, data, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); })
            .do(function (_) {
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return rxjs_compat_1.Observable.throwError(err);
        }); });
    };
    ApiClient.prototype.delete = function (path, notificationText) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (notificationText === void 0) { notificationText = 'Removing...'; }
        var reqStarted;
        return rxjs_compat_1.Observable.of(0)
            .do(function (_) { return reqStarted = _this._mediator.notifyRequestStarted(notificationText); })
            .switchMap(function (_) { return _this._http.delete(_this._baseUrl + "/" + path, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); })
            .do(function (_) {
            reqStarted.success.emit();
            reqStarted.complete.emit();
        })
            .catch(function (err) {
            reqStarted.error.emit(err);
            reqStarted.complete.emit();
            return rxjs_compat_1.Observable.throwError(err);
        }); });
    };
    ApiClient._unwrapJson = function (json) {
        if (json.status == "Failure")
            throw json.payload;
        return json.payload;
    };
    ApiClient._defaultHeaders = new http_1.HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    ApiClient._defaultOptions = { headers: ApiClient._defaultHeaders };
    return ApiClient;
}());
exports.ApiClient = ApiClient;
//# sourceMappingURL=api-client.js.map