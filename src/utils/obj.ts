export class Obj {
    static isString(obj: any): boolean {
        return typeof obj == 'string';
    }

    static isNumber(obj: any): boolean {
        return !isNaN(obj) && typeof obj == 'number';
    }

    static isBoolean(obj: any): boolean {
        return typeof obj == 'boolean';
    }

    static isObj(obj: any): boolean {
        return typeof obj == 'object';
    }
}