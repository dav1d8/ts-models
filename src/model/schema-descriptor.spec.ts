import {Model} from "./base-model";
import {many, ref} from "./schema-descriptor";
import {initStore, register} from "../store/store";

class Person extends Model {
    static schema = {
        __id: 'id',
        __modelName: 'Person',
        dogList: many('Dog'),
        house: ref('House')
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
        owner: ref('Person')
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
        owner: ref('Person')
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

let json = () => {
    return {
        id: 1,
        name: 'David',
        dogList: [
            {id: 1, name: 'Fifi'},
            {id: 2, name: 'Buksi'},
            {id: 3, name: 'Blöki'}
        ],
        house: {id: 1, address: 'Foo street 1', size: 100}
    }
};

describe('Schema descriptor test', () => {
    beforeEach(() => {
        initStore();
        register([Person, Dog, House]);
    });

    describe('ref', () => {
        it('the return object should have a model property with the appropriate model function', () => {
            expect(ref('Dog').model).toBe(Dog);
        });

        it('the return object should have a normalize function which normalizes the given JSON returning its id', () =>{
            let house = ref('House').extractId(json().house);
            expect(house).toBe(json().house.id);
        });
    });

    describe('many', () => {
        it('the return object should have a model property with the appropriate model function', () => {
            expect(many('Dog').model).toBe(Dog);
        });

        it('the return object should have a normalize function which normalizes the given JSON array '+
            'returning an array of id-s', () =>{
            let dogList = <number[]>many('Dog').extractId(json().dogList);
            expect(dogList.length).toBe(3);
            expect(dogList[0]).toBe(1);
            expect(dogList[1]).toBe(2);
            expect(dogList[2]).toBe(3);
        });
    });
});