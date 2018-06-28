export declare class Check {
    static notNull(obj: any, name?: string): void;
    static notNullOrEmptyString(obj: any, name?: string): void;
    static isType(obj: any, type: Function, name?: string): void;
    static isString(obj: any, name?: string): void;
    static isNumber(obj: any, name?: string): void;
    static isBoolean(obj: any, name?: string): void;
    static isObj(obj: any, name?: string): void;
}
