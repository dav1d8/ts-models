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
var base_model_1 = require("./base-model");
var schema_descriptor_1 = require("./schema-descriptor");
var store_1 = require("../store/store");
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
        dogList: schema_descriptor_1.many('Dog'),
        house: schema_descriptor_1.ref('House')
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
        owner: schema_descriptor_1.ref('Person')
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
        owner: schema_descriptor_1.ref('Person')
    };
    return House;
}(base_model_1.Model));
var json = function () {
    return {
        id: 1,
        name: 'David',
        dogList: [
            { id: 1, name: 'Fifi' },
            { id: 2, name: 'Buksi' },
            { id: 3, name: 'Blöki' }
        ],
        house: { id: 1, address: 'Foo street 1', size: 100 }
    };
};
describe('Schema descriptor test', function () {
    beforeEach(function () {
        store_1.initStore();
        store_1.register([Person, Dog, House]);
    });
    describe('ref', function () {
        it('the return object should have a model property with the appropriate model function', function () {
            expect(schema_descriptor_1.ref('Dog').model).toBe(Dog);
        });
        it('the return object should have a normalize function which normalizes the given JSON returning its id', function () {
            var house = schema_descriptor_1.ref('House').extractId(json().house);
            expect(house).toBe(json().house.id);
        });
    });
    describe('many', function () {
        it('the return object should have a model property with the appropriate model function', function () {
            expect(schema_descriptor_1.many('Dog').model).toBe(Dog);
        });
        it('the return object should have a normalize function which normalizes the given JSON array ' +
            'returning an array of id-s', function () {
            var dogList = schema_descriptor_1.many('Dog').extractId(json().dogList);
            expect(dogList.length).toBe(3);
            expect(dogList[0]).toBe(1);
            expect(dogList[1]).toBe(2);
            expect(dogList[2]).toBe(3);
        });
    });
});
//# sourceMappingURL=schema-descriptor.spec.js.map