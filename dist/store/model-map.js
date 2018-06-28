"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_model_1 = require("../model/base-model");
var check_1 = require("../utils/check");
var obj_1 = require("../utils/obj");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ModelMap = /** @class */ (function () {
    function ModelMap() {
        this._map = {};
        this._mapSubjects = {};
    }
    ModelMap.prototype.init = function () {
        this._map = {};
        this._mapSubjects = {};
    };
    ModelMap.prototype.add = function (model) {
        check_1.Check.notNull(model, 'model');
        check_1.Check.isType(model, base_model_1.Model, 'model');
        check_1.Check.notNullOrEmptyString(model.id, 'model.id');
        var slice = this.getTypeSlice(model._modelType);
        slice.map[model.id] = model;
        slice.source.next(Object.keys(slice.map).map(function (k) { return slice.map[k]; }));
    };
    ModelMap.prototype.remove = function (modelParam, id) {
        check_1.Check.notNull(modelParam, 'modelParam');
        var model;
        if (modelParam instanceof base_model_1.Model) {
            check_1.Check.notNullOrEmptyString(modelParam.id, 'modelParam.id');
            model = modelParam;
        }
        else {
            check_1.Check.notNullOrEmptyString(id, 'id');
            if (!(model = this.get(modelParam, id)))
                return;
        }
        delete this.getTypeSlice(model._modelType).map[model.id];
    };
    ModelMap.prototype.getTypeSlice = function (modelParam) {
        check_1.Check.notNull(modelParam, 'modelParam');
        var modelName = obj_1.Obj.isString(modelParam) ? modelParam : modelParam.schema.__modelName;
        if (!this._map[modelName]) {
            this._map[modelName] = {};
            this._mapSubjects[modelName] = new BehaviorSubject_1.BehaviorSubject([]);
        }
        return {
            map: this._map[modelName],
            source: this._mapSubjects[modelName]
        };
    };
    ModelMap.prototype.get = function (modelParam, id) {
        return this.getTypeSlice(modelParam).map[id];
    };
    return ModelMap;
}());
exports.ModelMap = ModelMap;
exports.modelMap = new ModelMap();
//# sourceMappingURL=model-map.js.map