"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("../store/store");
var RelationType;
(function (RelationType) {
    RelationType[RelationType["ref"] = 0] = "ref";
    RelationType[RelationType["many"] = 1] = "many";
})(RelationType = exports.RelationType || (exports.RelationType = {}));
var getModel = function (modelName) {
    if (store_1.modelTypeMap[modelName] == null) {
        throw modelName + " is not registered in the store";
    }
    return store_1.modelTypeMap[modelName];
};
exports.ref = function (modelName) {
    if (!modelName)
        throw "model is undefined";
    return {
        type: RelationType.ref,
        get model() {
            return getModel(modelName);
        },
        extractId: function (json) {
            if (!json)
                return null;
            return json[getModel(modelName).schema.__id];
        }
    };
};
exports.many = function (modelName) {
    if (!modelName)
        throw "model is undefined";
    return {
        type: RelationType.many,
        get model() {
            return getModel(modelName);
        },
        extractId: function (arr) {
            return arr.map(function (json) { return exports.ref(modelName).extractId(json); })
                .filter(function (i) { return i != null; });
        }
    };
};
//# sourceMappingURL=schema-descriptor.js.map