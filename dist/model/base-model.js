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
var obj_1 = require("../utils/obj");
var utils_1 = require("../utils/utils");
var schema_descriptor_1 = require("./schema-descriptor");
var model_observable_1 = require("../utils/model-observable");
var Rx_1 = require("rxjs/Rx");
var _ = require("lodash");
var jsonPatch = require("fast-json-patch");
var Model = /** @class */ (function () {
    function Model(__data) {
        if (__data === void 0) { __data = {}; }
        this.__data = __data;
        this.__subject = new Rx_1.Subject();
        this._$ = this.__subject.asObservable();
        this.__objectId = utils_1.Utils.generateUUID();
        this._takeSnapshot();
    }
    Model.getRefKeys = function (modelType) {
        return Object.keys(modelType.schema)
            .filter(function (k) { return !k.startsWith('__') && modelType.schema[k].type == schema_descriptor_1.RelationType.ref; });
    };
    Model.flat = function (obj, refKeys) {
        var result = {};
        Object.keys(obj).forEach(function (i) {
            // simple objects: number, string, boolean
            if (!obj_1.Obj.isObj(obj[i]) && !_.includes(refKeys, i.replace(/Id$/, ''))) {
                result[i] = obj[i];
            }
            // related objects - we need only the id
            if (obj[i] != null && _.includes(refKeys, i)) {
                result[i + 'Id'] = obj[i].id;
            }
        });
        return result;
    };
    Object.defineProperty(Model.prototype, "_modelType", {
        get: function () {
            return Object.getPrototypeOf(this).constructor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_modelName", {
        get: function () {
            return this._modelType.schema.__modelName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_data", {
        get: function () {
            return this.__data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "id", {
        get: function () {
            return this._get(this._modelType.schema.__id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_objectId", {
        get: function () {
            return this.__objectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_isNew", {
        get: function () {
            return !this.id;
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype._clone = function () {
        return new this._modelType(this.__data);
    };
    Model.prototype._flatten = function () {
        return Model.flat(this.__data, Model.getRefKeys(this._modelType));
    };
    Model.prototype._takeSnapshot = function () {
        this.__snapshot = Object.assign({}, this.__data);
    };
    Model.prototype._revert = function () {
        this.__data = this.__snapshot;
    };
    Model.prototype._getPatch = function () {
        var flatOriginal = Model.flat(this.__snapshot, Model.getRefKeys(this._modelType));
        return jsonPatch.compare(flatOriginal, this._flatten());
    };
    Model.prototype._get = function (name) {
        return this.__data[name];
    };
    Model.prototype._set = function (name, value) {
        var original;
        if (_.isObject(this.__data[name])) {
            original = Object.create(this.__data[name]);
        }
        else {
            original = this.__data[name];
        }
        this.__data[name] = value;
        this.__subject.next({
            path: name,
            model: this,
            action: 'change',
            oldValue: original
        });
    };
    /**
     * Generates all the Observable properties of the Model object that has been decorated with the
     * Calculated decorator. Should be called as the last call in the object's constructor.
     */
    Model.prototype._addCalculatedFields = function () {
        var _this = this;
        var reflect = window['Reflect'];
        var calculatedData = reflect.getMetadata('CALCULATED', Object.getPrototypeOf(this).constructor);
        var _loop_1 = function (key) {
            this_1[key] = this_1._calculatedObservable(calculatedData[key].config, function () { return _this[calculatedData[key].fnName](); });
        };
        var this_1 = this;
        for (var key in calculatedData) {
            _loop_1(key);
        }
    };
    /**
     * Generates an Observable, which gets new data anytime there is a change in the Model object on the configured
     * fields. Currently used with the Calculated decorator.
     * @param {string} config ConfigNode string, determines the watched properties of the model,
     * refer to ModelObservable for further explanation.
     * @param {() => any} fn Function to call when a change occurs. The functions return value will be then passed to
     * the generated Observable.
     * @returns {Observable<any>} Observable that gets it's next element through the passed function when the Model
     * object changes on properties defined by the ConfigNode
     */
    Model.prototype._calculatedObservable = function (config, fn) {
        var _this = this;
        return new Rx_1.Observable(function (observer) {
            var cn = model_observable_1.ModelObservable.stringToNode(_this._modelName, config, '\n', ' ');
            model_observable_1.ModelObservable.generate(_this, cn.children, false).subscribe(function () {
                observer.next(fn());
            });
            observer.next(fn());
        }).shareReplay();
    };
    // default
    Model.schema = {
        __id: 'id',
        __modelName: 'BaseModel'
    };
    return Model;
}());
exports.Model = Model;
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(initial) {
        if (initial === void 0) { initial = []; }
        var _this = _super.call(this) || this;
        // https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
        // HACK: Set the prototype explicitly.
        Object.setPrototypeOf(_this, List.prototype);
        _this.addRange(initial);
        return _this;
    }
    List.prototype.add = function (item) {
        this.push(item);
    };
    List.prototype.addRange = function (range) {
        for (var _i = 0, range_1 = range; _i < range_1.length; _i++) {
            var i = range_1[_i];
            this.add(i);
        }
    };
    List.prototype.remove = function (item) {
        var idx = this.indexOf(item);
        if (idx > -1)
            this.splice(idx, 1);
    };
    List.prototype.clear = function () {
        this.splice(0, this.length);
    };
    return List;
}(Array));
exports.List = List;
//# sourceMappingURL=base-model.js.map