"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_map_1 = require("./model-map");
var obj_1 = require("../utils/obj");
var behavior_list_1 = require("../model/behavior-list");
var check_1 = require("../utils/check");
exports.modelTypeMap = {};
exports.modelClientMap = {};
function initStore() {
    model_map_1.modelMap.init();
    exports.modelTypeMap = {};
}
exports.initStore = initStore;
function register(modelArray) {
    for (var _i = 0, modelArray_1 = modelArray; _i < modelArray_1.length; _i++) {
        var entry = modelArray_1[_i];
        if (entry.entityType) {
            exports.modelTypeMap[entry.entityType.schema.__modelName] = entry.entityType;
            exports.modelClientMap[entry.entityType.schema.__modelName] = entry.client;
        }
        else {
            exports.modelTypeMap[entry.schema.__modelName] = entry;
            exports.modelClientMap[entry.schema.__modelName] = undefined;
        }
    }
}
exports.register = register;
function remove(id, modelName) {
    model_map_1.modelMap.remove(modelName, id);
}
exports.remove = remove;
function process(json, rootModelName, existingRef) {
    var workingObj = Object.assign({}, json);
    var processCache = {};
    return processInternal(workingObj, rootModelName, processCache, existingRef);
}
exports.process = process;
function processMany(json, rootModelName, existingRef) {
    if (existingRef === void 0) { existingRef = []; }
    var workingObj = Object.assign([], json);
    var processCache = {};
    return workingObj.reduce(function (prev, curr, currIdx) {
        var model = processInternal(curr, rootModelName, processCache, existingRef[currIdx]);
        return prev.concat(model);
    }, []);
}
exports.processMany = processMany;
function processInternal(json, modelParam, processCache, existingRef) {
    check_1.Check.notNull(json, 'json');
    var modelType = modelParam;
    if (obj_1.Obj.isString(modelParam))
        modelType = exports.modelTypeMap[modelParam];
    var model = existingRef || model_map_1.modelMap.get(modelType, json[modelType.schema.__id]) || new modelType();
    // Check.NotNull(json.$id, '$id');
    if (json.$id) {
        if (!processCache[json.$id])
            processCache[json.$id] = model;
        else {
            Object.assign(processCache[json.$id]._data, json);
            delete processCache[json.$id]._data['$id'];
        }
    }
    if (!json.$ref) {
        Object.keys(json).forEach(function (propName) {
            if (!obj_1.Obj.isObj(json[propName]) || json[propName] == null) {
                // simple prop or null
                model._data[propName] = json[propName];
            }
            else {
                // array
                if (Array.isArray(json[propName]) || json[propName].$values) {
                    if (!modelType.schema[propName]) {
                        var subscriptionBehaviour = void 0;
                        if (model._data[propName] && model._data[propName]['subscriptionBehaviour']) {
                            (model._data[propName]).clear();
                            subscriptionBehaviour = model._data[propName]['subscriptionBehaviour'];
                        }
                        model._data[propName] = new behavior_list_1.BehaviorList(json[propName]);
                        if (subscriptionBehaviour) {
                            (model._data[propName]).setSubscriptionConfig(subscriptionBehaviour);
                        }
                    }
                    else {
                        var modelList = new behavior_list_1.BehaviorList();
                        if (model._data[propName]) {
                            (model._data[propName]).clear();
                            modelList = model._data[propName];
                        }
                        for (var _i = 0, _a = json[propName]; _i < _a.length; _i++) {
                            var obj = _a[_i];
                            modelList.add(processInternal(obj, modelType.schema[propName].model, processCache));
                        }
                        model._data[propName] = modelList;
                    }
                }
                else if (json[propName].$ref) {
                    var navProp = processCache[json[propName].$ref] || new modelType.schema[propName].model();
                    processCache[json[propName].$ref] = navProp;
                    model._data[propName] = navProp;
                }
                else {
                    if (!modelType.schema[propName])
                        model._data[propName] = json[propName];
                    else
                        model._data[propName] = processInternal(json[propName], modelType.schema[propName].model, processCache);
                }
            }
        });
    }
    else {
        model = processCache[json.$ref] || new modelType();
        processCache[json.$ref] = model;
        return model;
    }
    model._takeSnapshot();
    model_map_1.modelMap.add(model);
    return model;
}
//# sourceMappingURL=store.js.map