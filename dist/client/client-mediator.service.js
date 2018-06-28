"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ClientMediator = /** @class */ (function () {
    function ClientMediator() {
        this._emitter = new core_1.EventEmitter();
    }
    Object.defineProperty(ClientMediator.prototype, "events", {
        get: function () {
            return this._emitter.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ClientMediator.prototype.notifyRequestStarted = function (text) {
        var reqStarted = new RequestStartedEventArgs(text);
        this._emitter.emit(reqStarted);
        return reqStarted;
    };
    ClientMediator = __decorate([
        core_1.Injectable()
    ], ClientMediator);
    return ClientMediator;
}());
exports.ClientMediator = ClientMediator;
var RequestStartedEventArgs = /** @class */ (function () {
    function RequestStartedEventArgs(text) {
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.complete = new core_1.EventEmitter();
        this.text = text;
    }
    return RequestStartedEventArgs;
}());
exports.RequestStartedEventArgs = RequestStartedEventArgs;
//# sourceMappingURL=client-mediator.service.js.map