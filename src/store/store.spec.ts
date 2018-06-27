import {modelTypeMap, register, process, initStore, remove} from "./store";
import {List, Model} from "../model/base-model";
import {modelMap} from "./model-map";
import {many, ref} from "../model/schema-descriptor";

class Person extends Model {
    static schema = {
        __id: 'id',
        __modelName: 'Person',
        dogList: many('Dog'),
        house: ref('House')
    };

    constructor(data: any) {
        super(data);
        this.dogList = new List<Dog>();
    }

    get name() {
        return this._get('name');
    }

    set name(value) {
        this._set('name', value);
    }

    get dogList(): List<Dog> {
        return this._get("dogList");
    }

    set dogList(value: List<Dog>) {
        this._set("dogList", value);
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

describe('Store test', () => {
    beforeEach(() => {
        initStore();
        register([Person, Dog, House]);
    });

    describe('register', () => {

        it('should contain the registered models', () => {
            expect(modelTypeMap['Person']).toBe(Person);
            expect(modelTypeMap['Dog']).toBe(Dog);
            expect(modelTypeMap['House']).toBe(House);
        });

        it('couldn\'t contain any other model class', () => {
            expect(modelTypeMap['Any']).toBeUndefined();
        });
    });

    describe('process', () => {
        it('normalizes the nested json tree in any depth recursively and stores the normalized entities', () => {
            process(json(), 'Person');
            expect((<Person>modelMap.get('Person', 1)).name).toBe('David');
            expect((<Dog>modelMap.get('Dog', 1)).name).toBe('Fifi');
            expect((<Dog>modelMap.get('Dog', 2)).name).toBe('Buksi');
            expect((<Dog>modelMap.get('Dog', 3)).name).toBe('Blöki');
            expect((<House>modelMap.get('House', 1)).address).toBe('Foo street 1');
        });

        it('skips those fields which aren\'t present in the JSON but are configured in model schema', () => {
            process({id: 2, name: 'Daniel'}, 'Person');
            expect((<Person>modelMap.get('Person', 2)).name).toBe("Daniel");
            expect((<Person>modelMap.get('Person', 2)).dogList.length).toBe(0);
        });

        it('returns the reference of the stored entity', () => {
            expect(process(json(), 'Person')).toBe(modelMap.get('Person', 1)!);
        });

        it('stores the same reference in the list as in the modelMap', () => {
            let person: Person = process<Person>(json(), 'Person');
            expect(<Model>person.dogList[0]).toBe(modelMap.get('Dog', 1)!);

            (<Dog>modelMap.get('Dog', 1)).name = 'valami más';
            expect(person.dogList[0].name).toBe('valami más');
        });

        it('merges the newly received entities into the existing ones', () => {
            process(json(), 'Person');
            expect((<House>modelMap.get('House', 1)).size).toBe(100);

            process({id: 1, size: 120}, 'House');
            expect((<House>modelMap.get('House', 1)).size).toBe(120);
            expect((<House>modelMap.get('House', 1)).address).toBe('Foo street 1');
        });
    });

    describe('remove', () => {
        it('removes the entity from the store', () => {
            process(json(), 'Person');
            expect((<Person>modelMap.get('Person', 1)).dogList.length).toBe(3);

            remove(1, 'Dog');
            expect(modelMap.get('Dog', 1)).toBeUndefined();
        });
    });
});