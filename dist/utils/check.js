"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var obj_1 = require("./obj");
var Check = /** @class */ (function () {
    function Check() {
    }
    Check.notNull = function (obj, name) {
        if (obj == null) {
            throw new Error((name || 'The object') + " cannot be null");
        }
    };
    Check.notNullOrEmptyString = function (obj, name) {
        if (obj == null || obj === '') {
            throw new Error((name || 'The object') + " cannot be null or empty string");
        }
    };
    Check.isType = function (obj, type, name) {
        if (!(obj instanceof type)) {
            throw new Error((name || 'The object') + " must be an instance of " + type.name);
        }
    };
    Check.isString = function (obj, name) {
        if (!obj_1.Obj.isString(obj)) {
            throw new Error((name || 'The object') + " must be a string");
        }
    };
    Check.isNumber = function (obj, name) {
        if (!obj_1.Obj.isNumber(obj)) {
            throw new Error((name || 'The object') + " must be a number");
        }
    };
    Check.isBoolean = function (obj, name) {
        if (!obj_1.Obj.isBoolean(obj)) {
            throw new Error((name || 'The object') + " must be a boolean");
        }
    };
    Check.isObj = function (obj, name) {
        if (!obj_1.Obj.isObj(obj)) {
            throw new Error((name || 'The object') + " must be an object");
        }
    };
    return Check;
}());
exports.Check = Check;
//# sourceMappingURL=check.js.map