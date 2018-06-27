import {Obj} from "./obj";
export class Check {
    static notNull(obj: any, name?: string) {
        if (obj == null) {
            throw new Error(`${name || 'The object'} cannot be null`);
        }
    }

    static notNullOrEmptyString(obj: any, name?: string) {
        if (obj == null || obj === '') {
            throw new Error(`${name || 'The object'} cannot be null or empty string`);
        }
    }

    static isType(obj: any, type: Function, name?: string) {
        if (!(obj instanceof type)) {
            throw new Error(`${name || 'The object'} must be an instance of ${type.name}`);
        }
    }

    static isString(obj: any, name?: string): void {
        if(!Obj.isString(obj)){
            throw new Error(`${name || 'The object'} must be a string`);
        }
    }

    static isNumber(obj: any, name?: string): void {
        if(!Obj.isNumber(obj)){
            throw new Error(`${name || 'The object'} must be a number`);
        }
    }

    static isBoolean(obj: any, name?: string): void {
        if(!Obj.isBoolean(obj)){
            throw new Error(`${name || 'The object'} must be a boolean`);
        }
    }

    static isObj(obj: any, name?: string): void {
        if(!Obj.isObj(obj)){
            throw new Error(`${name || 'The object'} must be an object`);
        }
    }
}