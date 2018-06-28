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
var model_map_1 = require("./model-map");
var base_model_1 = require("../model/base-model");
var Person = /** @class */ (function (_super) {
    __extends(Person, _super);
    function Person() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Person.prototype, "name", {
        get: function () {
            return this._get('name');
        },
        set: function (value) {
            this._set('name', value);
        },
        enumerable: true,
        configurable: true
    });
    Person.schema = {
        __id: 'id',
        __modelName: 'Person',
    };
    return Person;
}(base_model_1.Model));
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Dog.prototype, "name", {
        get: function () {
            return this._get('name');
        },
        set: function (value) {
            this._set('name', value);
        },
        enumerable: true,
        configurable: true
    });
    Dog.schema = {
        __id: 'id',
        __modelName: 'Dog',
    };
    return Dog;
}(base_model_1.Model));
var House = /** @class */ (function (_super) {
    __extends(House, _super);
    function House() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(House.prototype, "address", {
        get: function () {
            return this._get('address');
        },
        set: function (value) {
            this._set('address', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(House.prototype, "size", {
        get: function () {
            return this._get('size');
        },
        set: function (value) {
            this._set('size', value);
        },
        enumerable: true,
        configurable: true
    });
    House.schema = {
        __id: 'id',
        __modelName: 'House',
    };
    return House;
}(base_model_1.Model));
describe('ModelMap', function () {
    beforeEach(function () {
        model_map_1.modelMap.init();
    });
    describe('init', function () {
        it('should initialize the map with an empty object', function () {
            model_map_1.modelMap.add(new Person({ id: 1, name: 'Rick' }));
            expect(model_map_1.modelMap.get(Person, 1)).toBeDefined();
            model_map_1.modelMap.init();
            expect(model_map_1.modelMap.get(Person, 1)).toBeUndefined();
        });
    });
    describe('add', function () {
        it('should add model instances to the map', function () {
            model_map_1.modelMap.add(new Person({ id: 1, name: 'Rick' }));
            expect(model_map_1.modelMap.get(Person, 1)).toBeDefined();
            expect(function () { return model_map_1.modelMap.add({ id: 1, name: 'Rick' }); }).toThrowError(/must be an instance of Model/);
        });
        it('should accept only a valid model instance', function () {
            expect(function () { return model_map_1.modelMap.add(new Person({ name: 'Rick' })); }).toThrowError(/cannot be null or empty string/);
        });
    });
    describe('remove', function () {
        var model = new Person({ id: 1, name: 'Rick' });
        beforeEach(function () {
            model_map_1.modelMap.add(model);
        });
        it('should remove the given model instance', function () {
            expect(model_map_1.modelMap.get(Person, 1)).toBeDefined();
            model_map_1.modelMap.remove(model);
            expect(model_map_1.modelMap.get(Person, 1)).toBeUndefined();
        });
        it('should remove the model instance by the given type name and id', function () {
            expect(model_map_1.modelMap.get(Person, 1)).toBeDefined();
            model_map_1.modelMap.remove('Person', 1);
            expect(model_map_1.modelMap.get(Person, 1)).toBeUndefined();
        });
        it('should accept parameters which don\'t identify an existing object', function () {
            expect(model_map_1.modelMap.get(Person, 1)).toBeDefined();
            expect(function () { return model_map_1.modelMap.remove('Animal', 1); }).not.toThrow();
            expect(function () { return model_map_1.modelMap.remove('Person', 2); }).not.toThrow();
        });
    });
    describe('getTypeSlice', function () {
        var model1 = new Person({ id: 1, name: 'Rick' });
        var model2 = new Dog({ id: 123, name: 'Snoopy' });
        beforeEach(function () {
            model_map_1.modelMap.add(model1);
            model_map_1.modelMap.add(model2);
        });
        it('should return an associative array of the given type', function () {
            expect(model_map_1.modelMap.getTypeSlice(Person).map).toEqual({ 1: model1 });
            expect(model_map_1.modelMap.getTypeSlice(Dog).map).toEqual({ 123: model2 });
        });
        it('should return an associative array of the given type name', function () {
            expect(model_map_1.modelMap.getTypeSlice('Person').map).toEqual({ 1: model1 });
            expect(model_map_1.modelMap.getTypeSlice('Dog').map).toEqual({ 123: model2 });
        });
        it('should return an return an empty object when the given slice doesn\'t exist yet', function () {
            expect(model_map_1.modelMap.getTypeSlice('NonExisting').map).toEqual({});
            expect(model_map_1.modelMap.getTypeSlice(House).map).toEqual({});
        });
    });
    describe('get', function () {
        var model = new Person({ id: 1, name: 'Rick' });
        beforeEach(function () {
            model_map_1.modelMap.add(model);
        });
        it('should return a model instance by the given type and id', function () {
            expect(model_map_1.modelMap.get(Person, 1)).toBe(model);
        });
        it('should return a model instance by the given type name and id', function () {
            expect(model_map_1.modelMap.get('Person', 1)).toBe(model);
        });
        it('should return undefined if there is no result', function () {
            expect(model_map_1.modelMap.get('AnyType', 1)).toBeUndefined();
            expect(model_map_1.modelMap.get(Person, 12345)).toBeUndefined();
        });
    });
});
//# sourceMappingURL=model-map.spec.js.map