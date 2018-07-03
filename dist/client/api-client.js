"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var http_1 = require("@angular/common/http");
var ApiClient = /** @class */ (function () {
    function ApiClient(_baseUrl, _http) {
        this._baseUrl = _baseUrl;
        this._http = _http;
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
    ApiClient.prototype.get = function (path, data) {
        if (path === void 0) { path = ''; }
        var queryString = ApiClient.getQueryString(data);
        return this._http
            .get(this._baseUrl + "/" + path + queryString, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); });
    };
    ApiClient.prototype.post = function (path, data) {
        if (path === void 0) { path = ''; }
        return this._http
            .post(this._baseUrl + "/" + path, data, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); });
    };
    ApiClient.prototype.patch = function (path, data) {
        if (path === void 0) { path = ''; }
        return this._http
            .patch(this._baseUrl + "/" + path, data, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); });
    };
    ApiClient.prototype.put = function (path, data) {
        if (path === void 0) { path = ''; }
        return this._http
            .put(this._baseUrl + "/" + path, data, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); });
    };
    ApiClient.prototype.delete = function (path) {
        if (path === void 0) { path = ''; }
        return this._http
            .delete(this._baseUrl + "/" + path, ApiClient._defaultOptions)
            .map(function (json) { return ApiClient._unwrapJson(json); });
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