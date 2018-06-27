import {List, Model} from "./base-model";
import {many, ref} from "./schema-descriptor";

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

    get owner(): Person {
        return this._get('owner');
    }

    set owner(value: Person) {
        this._set('owner', value);
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

let data = () => {
    return {
        house: new House({id: 1, address: 'Foo street 1', size: 100}),
        person: new Person({id: 1, name: 'David'}),
        dog1: new Dog({id: 1, name: 'Fifi'}),
        dog2: new Dog({id: 2, name: 'Buksi'}),
        dog3: new Dog({id: 3, name: 'Blöki'}),
    }
};

let person: Person | null = null;
let currentData: any;

describe('Base model test', () => {
    beforeEach(() => {
        currentData = data();
        person = currentData.person;
        person!.dogList.addRange([currentData.dog1, currentData.dog2, currentData.dog3]);
        person!._takeSnapshot();
    });

    describe('clone', () => {
        it('copies the object but the reference should\'t be the same', () => {
            let person2 = person!._clone<Person>();

            expect(person).toBe(person);
            expect(person).not.toBe(person2);
            expect(person!.name).toBe(person2.name);
        });
    });

    describe('getPatch', () => {
        it('should generate a json patch from the property changes', () => {
            person!.name = 'Lujza';
            expect(person!._getPatch()).toEqual([{op: 'replace', path: '/name', value: 'Lujza'}]);
        });
    });

    describe('model list', () => {
        it('should get a list of model', () => {
            expect(person!.dogList.length).toBe(3);
        });

        it('can add a new model (from the store) to the list', () => {
            let dog1 = new Dog({id: 123, name: 'Cézár'});
            dog1.owner = person!;

            let dog2 = new Dog({id: 423, name: 'Filkó'});
            dog2.owner = person!;

            person!.dogList.add(dog1);
            person!.dogList.add(dog2);
            expect(person!.dogList.length).toBe(5);

            expect(person!.dogList[3].name).toBe('Cézár');
        });

        // xit('should throw an exception if you\'re trying to add an item that already exists on the list', () => {
        //     let existingDog = person.dogList[1];
        //     expect(() => person.dogList.add(existingDog)).toThrow('This list already contains the given item.');
        // });

        it('removes the given item from the list', () => {
            let existingDog = person!.dogList[1];
            person!.dogList.remove(existingDog);
            expect(person!.dogList.find(i => i.id === existingDog.id)).toBeUndefined();
        });

        it('removes all item from the list', () => {
            person!.dogList.clear();
            expect(person!.dogList.length).toBe(0);
        });
    });
});
