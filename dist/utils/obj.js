"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Obj = /** @class */ (function () {
    function Obj() {
    }
    Obj.isString = function (obj) {
        return typeof obj == 'string';
    };
    Obj.isNumber = function (obj) {
        return !isNaN(obj) && typeof obj == 'number';
    };
    Obj.isBoolean = function (obj) {
        return typeof obj == 'boolean';
    };
    Obj.isObj = function (obj) {
        return typeof obj == 'object';
    };
    return Obj;
}());
exports.Obj = Obj;
//# sourceMappingURL=obj.js.map