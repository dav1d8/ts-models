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
var Person = /** @class */ (function (_super) {
    __extends(Person, _super);
    function Person(data) {
        var _this = _super.call(this, data) || this;
        _this.dogList = new base_model_1.List();
        return _this;
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
    Object.defineProperty(Person.prototype, "dogList", {
        get: function () {
            return this._get("dogList");
        },
        set: function (value) {
            this._set("dogList", value);
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
    Object.defineProperty(Dog.prototype, "owner", {
        get: function () {
            return this._get('owner');
        },
        set: function (value) {
            this._set('owner', value);
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
var data = function () {
    return {
        house: new House({ id: 1, address: 'Foo street 1', size: 100 }),
        person: new Person({ id: 1, name: 'David' }),
        dog1: new Dog({ id: 1, name: 'Fifi' }),
        dog2: new Dog({ id: 2, name: 'Buksi' }),
        dog3: new Dog({ id: 3, name: 'Blöki' }),
    };
};
var person = null;
var currentData;
describe('Base model test', function () {
    beforeEach(function () {
        currentData = data();
        person = currentData.person;
        person.dogList.addRange([currentData.dog1, currentData.dog2, currentData.dog3]);
        person._takeSnapshot();
    });
    describe('clone', function () {
        it('copies the object but the reference should\'t be the same', function () {
            var person2 = person._clone();
            expect(person).toBe(person);
            expect(person).not.toBe(person2);
            expect(person.name).toBe(person2.name);
        });
    });
    describe('getPatch', function () {
        it('should generate a json patch from the property changes', function () {
            person.name = 'Lujza';
            expect(person._getPatch()).toEqual([{ op: 'replace', path: '/name', value: 'Lujza' }]);
        });
    });
    describe('model list', function () {
        it('should get a list of model', function () {
            expect(person.dogList.length).toBe(3);
        });
        it('can add a new model (from the store) to the list', function () {
            var dog1 = new Dog({ id: 123, name: 'Cézár' });
            dog1.owner = person;
            var dog2 = new Dog({ id: 423, name: 'Filkó' });
            dog2.owner = person;
            person.dogList.add(dog1);
            person.dogList.add(dog2);
            expect(person.dogList.length).toBe(5);
            expect(person.dogList[3].name).toBe('Cézár');
        });
        // xit('should throw an exception if you\'re trying to add an item that already exists on the list', () => {
        //     let existingDog = person.dogList[1];
        //     expect(() => person.dogList.add(existingDog)).toThrow('This list already contains the given item.');
        // });
        it('removes the given item from the list', function () {
            var existingDog = person.dogList[1];
            person.dogList.remove(existingDog);
            expect(person.dogList.find(function (i) { return i.id === existingDog.id; })).toBeUndefined();
        });
        it('removes all item from the list', function () {
            person.dogList.clear();
            expect(person.dogList.length).toBe(0);
        });
    });
});
//# sourceMappingURL=base-model.spec.js.map