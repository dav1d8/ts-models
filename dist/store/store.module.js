"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var client_1 = require("../client");
var store_service_1 = require("./store.service");
var StoreModule = /** @class */ (function () {
    function StoreModule() {
    }
    StoreModule_1 = StoreModule;
    StoreModule.forRoot = function () {
        return {
            ngModule: StoreModule_1,
            providers: [
                store_service_1.Store,
                client_1.ClientMediator
            ]
        };
    };
    var StoreModule_1;
    StoreModule = StoreModule_1 = __decorate([
        core_1.NgModule({
            imports: [],
            exports: [],
            declarations: [],
        })
    ], StoreModule);
    return StoreModule;
}());
exports.StoreModule = StoreModule;
//# sourceMappingURL=store.module.js.map