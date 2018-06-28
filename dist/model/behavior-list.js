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
var model_observable_1 = require("../utils/model-observable");
var Subject_1 = require("rxjs/Subject");
var _ = require("lodash");
/**
 * Observable version of List<T>, should be integrated with the ModelObservable class.
 * Fires an event on its subject when an item gets added, removed or the list gets cleared.
 * Additionally it can be configured to listen to the changes of the contained elements with the use of ConfigNode.
 */
var BehaviorList = /** @class */ (function (_super) {
    __extends(BehaviorList, _super);
    function BehaviorList(initial) {
        if (initial === void 0) { initial = []; }
        var _this = _super.call(this) || this;
        // https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
        // HACK: Set the prototype explicitly.
        Object.setPrototypeOf(_this, BehaviorList.prototype);
        _this._subject = new Subject_1.Subject();
        _this.subscriptions = [];
        _this.addRange(initial);
        return _this;
    }
    BehaviorList.prototype.add = function (item) {
        this.push(item);
    };
    BehaviorList.prototype.push = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var retNum = _super.prototype.push.apply(this, items);
        items.forEach(function (value) {
            if (!_.isUndefined(_this.subscriptionBehaviour)) {
                _this.subscriptions.push(model_observable_1.ModelObservable.generate(value, _this.subscriptionBehaviour)
                    .subscribe(function (om) {
                    _this._subject.next(om);
                }));
            }
        });
        this._subject.next({ path: '', model: items, action: 'add' });
        return retNum;
    };
    BehaviorList.prototype.addRange = function (range) {
        for (var _i = 0, range_1 = range; _i < range_1.length; _i++) {
            var i = range_1[_i];
            this.add(i);
        }
    };
    BehaviorList.prototype.remove = function (item) {
        var idx = this.indexOf(item);
        if (idx > -1) {
            if (this.subscriptions.length) {
                this.subscriptions[idx].unsubscribe();
                this.subscriptions.splice(idx, 1);
            }
            this.splice(idx, 1);
            this._subject.next({ path: '', model: item, action: 'remove' });
        }
    };
    BehaviorList.prototype.clear = function () {
        this.clearSubscriptions();
        this.splice(0, this.length);
        this._subject.next({ path: '', model: null, action: 'clear' });
    };
    BehaviorList.prototype.clearSubscriptions = function () {
        if (this.subscriptions.length) {
            this.subscriptions.forEach(function (value) { return value.unsubscribe(); });
            this.subscriptions.splice(0, this.subscriptions.length);
        }
    };
    /**
     * For using detection in the elements, a ConfigNode must be provided.
     * For every element in a list a Subscription is created which does not affect the element itself.
     * Multiple calls of this function will only preserve the subscriptions of the last one.
     * @param {ConfigNode} configArray
     */
    BehaviorList.prototype.setSubscriptionConfig = function (configArray) {
        var _this = this;
        this.subscriptionBehaviour = configArray;
        this.clearSubscriptions();
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var value = _a[_i];
            this.subscriptions.push(model_observable_1.ModelObservable.generate(value, this.subscriptionBehaviour)
                .subscribe(function (om) {
                _this._subject.next(om);
            }));
        }
    };
    return BehaviorList;
}(Array));
exports.BehaviorList = BehaviorList;
//# sourceMappingURL=behavior-list.js.map