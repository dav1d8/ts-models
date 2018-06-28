"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("./store");
var Store = /** @class */ (function () {
    function Store() {
    }
    Store.prototype.add = function (json, type, existingRef) {
        return store_1.process(json, type, existingRef);
    };
    Store.prototype.addMany = function (json, type, existingRef) {
        return store_1.processMany(json, type, existingRef);
    };
    Store.prototype.remove = function (id, modelName) {
        store_1.remove(id, modelName);
    };
    Store.prototype.registerModel = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        store_1.register(params);
    };
    Store = __decorate([
        core_1.Injectable()
    ], Store);
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=store.service.js.map