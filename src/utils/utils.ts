import {Check} from "./check";

export class Utils {
    static serialize(obj: any): string {
        let str = [];

        for (let p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] != null) {
                if (Array.isArray(obj[p])) {
                    for (let v of obj[p]) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(v));
                    }
                } else {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
        }

        return str.join("&");
    }

    static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static generateRandomId(): number {
        return Math.floor((1 + Math.random()) * 0x10000000)
    }

    static getExtension(fileName: string) {
        Check.notNullOrEmptyString(fileName);

        if (fileName.length == 2)
            return '';

        let idx = fileName.lastIndexOf('.');
        if (idx > 0)
            return fileName.substr(idx + 1);

        return '';
    }

    static stringToIntArray(arrayString: string, separator: string) {
        if (arrayString != null && arrayString != '') {
            return arrayString.split(separator).map(Number);
        }else{
            return [];
        }
    }
}