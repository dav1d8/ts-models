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
var store_1 = require("./store");
var base_model_1 = require("../model/base-model");
var model_map_1 = require("./model-map");
var schema_descriptor_1 = require("../model/schema-descriptor");
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
describe('Store test', function () {
    beforeEach(function () {
        store_1.initStore();
        store_1.register([Person, Dog, House]);
    });
    describe('register', function () {
        it('should contain the registered models', function () {
            expect(store_1.modelTypeMap['Person']).toBe(Person);
            expect(store_1.modelTypeMap['Dog']).toBe(Dog);
            expect(store_1.modelTypeMap['House']).toBe(House);
        });
        it('couldn\'t contain any other model class', function () {
            expect(store_1.modelTypeMap['Any']).toBeUndefined();
        });
    });
    describe('process', function () {
        it('normalizes the nested json tree in any depth recursively and stores the normalized entities', function () {
            store_1.process(json(), 'Person');
            expect(model_map_1.modelMap.get('Person', 1).name).toBe('David');
            expect(model_map_1.modelMap.get('Dog', 1).name).toBe('Fifi');
            expect(model_map_1.modelMap.get('Dog', 2).name).toBe('Buksi');
            expect(model_map_1.modelMap.get('Dog', 3).name).toBe('Blöki');
            expect(model_map_1.modelMap.get('House', 1).address).toBe('Foo street 1');
        });
        it('skips those fields which aren\'t present in the JSON but are configured in model schema', function () {
            store_1.process({ id: 2, name: 'Daniel' }, 'Person');
            expect(model_map_1.modelMap.get('Person', 2).name).toBe("Daniel");
            expect(model_map_1.modelMap.get('Person', 2).dogList.length).toBe(0);
        });
        it('returns the reference of the stored entity', function () {
            expect(store_1.process(json(), 'Person')).toBe(model_map_1.modelMap.get('Person', 1));
        });
        it('stores the same reference in the list as in the modelMap', function () {
            var person = store_1.process(json(), 'Person');
            expect(person.dogList[0]).toBe(model_map_1.modelMap.get('Dog', 1));
            model_map_1.modelMap.get('Dog', 1).name = 'valami más';
            expect(person.dogList[0].name).toBe('valami más');
        });
        it('merges the newly received entities into the existing ones', function () {
            store_1.process(json(), 'Person');
            expect(model_map_1.modelMap.get('House', 1).size).toBe(100);
            store_1.process({ id: 1, size: 120 }, 'House');
            expect(model_map_1.modelMap.get('House', 1).size).toBe(120);
            expect(model_map_1.modelMap.get('House', 1).address).toBe('Foo street 1');
        });
    });
    describe('remove', function () {
        it('removes the entity from the store', function () {
            store_1.process(json(), 'Person');
            expect(model_map_1.modelMap.get('Person', 1).dogList.length).toBe(3);
            store_1.remove(1, 'Dog');
            expect(model_map_1.modelMap.get('Dog', 1)).toBeUndefined();
        });
    });
});
//# sourceMappingURL=store.spec.js.map