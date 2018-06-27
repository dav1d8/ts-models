import {modelMap} from "./model-map";
import {Model} from "../model/base-model";

class Person extends Model {
    static schema = {
        __id: 'id',
        __modelName: 'Person',
    };

    get name() {
        return this._get('name');
    }

    set name(value) {
        this._set('name', value);
    }
}

class Dog extends Model {
    static schema = {
        __id: 'id',
        __modelName: 'Dog',
    };

    get name() {
        return this._get('name');
    }

    set name(value) {
        this._set('name', value);
    }
}

class House extends Model {
    static schema = {
        __id: 'id',
        __modelName: 'House',
    };

    get address() {
        return this._get('address');
    }

    set address(value) {
        this._set('address', value);
    }

    get size() {
        return this._get('size');
    }

    set size(value) {
        this._set('size', value);
    }
}

describe('ModelMap', () => {
    beforeEach(() => {
        modelMap.init()
    });

    describe('init', () => {
        it('should initialize the map with an empty object', () => {
            modelMap.add(new Person({id: 1, name: 'Rick'}));
            expect(modelMap.get(Person, 1)).toBeDefined();

            modelMap.init();
            expect(modelMap.get(Person, 1)).toBeUndefined();
        });
    });

    describe('add', () => {
        it('should add model instances to the map', () => {
            modelMap.add(new Person({id: 1, name: 'Rick'}));
            expect(modelMap.get(Person, 1)).toBeDefined();

            expect(() => modelMap.add(<Person>{id: 1, name: 'Rick'})).toThrowError(/must be an instance of Model/);
        });

        it('should accept only a valid model instance', () => {
            expect(() => modelMap.add(new Person({name: 'Rick'}))).toThrowError(/cannot be null or empty string/);
        });
    });

    describe('remove', () => {
        let model = new Person({id: 1, name: 'Rick'});

        beforeEach(() => {
            modelMap.add(model);
        });

        it('should remove the given model instance', () => {
            expect(modelMap.get(Person, 1)).toBeDefined();
            modelMap.remove(model);
            expect(modelMap.get(Person, 1)).toBeUndefined();
        });

        it('should remove the model instance by the given type name and id', () => {
            expect(modelMap.get(Person, 1)).toBeDefined();
            modelMap.remove('Person', 1);
            expect(modelMap.get(Person, 1)).toBeUndefined();
        });

        it('should accept parameters which don\'t identify an existing object', () => {
            expect(modelMap.get(Person, 1)).toBeDefined();
            expect(() => modelMap.remove('Animal', 1)).not.toThrow();
            expect(() => modelMap.remove('Person', 2)).not.toThrow();
        });
    });

    describe('getTypeSlice', () => {
        let model1 = new Person({id: 1, name: 'Rick'});
        let model2 = new Dog({id: 123, name: 'Snoopy'});

        beforeEach(() => {
            modelMap.add(model1);
            modelMap.add(model2);
        });

        it('should return an associative array of the given type', () => {
            expect(modelMap.getTypeSlice(Person).map).toEqual({1: model1});
            expect(modelMap.getTypeSlice(Dog).map).toEqual({123: model2});
        });

        it('should return an associative array of the given type name', () => {
            expect(modelMap.getTypeSlice('Person').map).toEqual({1: model1});
            expect(modelMap.getTypeSlice('Dog').map).toEqual({123: model2});
        });

        it('should return an return an empty object when the given slice doesn\'t exist yet', () => {
            expect(modelMap.getTypeSlice('NonExisting').map).toEqual({});
            expect(modelMap.getTypeSlice(House).map).toEqual({});
        });
    });

    describe('get', () => {
        let model = new Person({id: 1, name: 'Rick'});

        beforeEach(() => {
            modelMap.add(model);
        });

        it('should return a model instance by the given type and id', () => {
            expect(modelMap.get(Person, 1)).toBe(model);
        });

        it('should return a model instance by the given type name and id', () => {
            expect(modelMap.get('Person', 1)).toBe(model);
        });

        it('should return undefined if there is no result', () => {
            expect(modelMap.get('AnyType', 1)).toBeUndefined();
            expect(modelMap.get(Person, 12345)).toBeUndefined();
        });
    });
});