"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var check_1 = require("./check");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.serialize = function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] != null) {
                if (Array.isArray(obj[p])) {
                    for (var _i = 0, _a = obj[p]; _i < _a.length; _i++) {
                        var v = _a[_i];
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(v));
                    }
                }
                else {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
        }
        return str.join("&");
    };
    Utils.generateUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    Utils.generateRandomId = function () {
        return Math.floor((1 + Math.random()) * 0x10000000);
    };
    Utils.getExtension = function (fileName) {
        check_1.Check.notNullOrEmptyString(fileName);
        if (fileName.length == 2)
            return '';
        var idx = fileName.lastIndexOf('.');
        if (idx > 0)
            return fileName.substr(idx + 1);
        return '';
    };
    Utils.stringToIntArray = function (arrayString, separator) {
        if (arrayString != null && arrayString != '') {
            return arrayString.split(separator).map(Number);
        }
        else {
            return [];
        }
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map