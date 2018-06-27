import {modelTypeMap} from "../store/store";
import {ModelType} from "./base-model";

export enum RelationType {
    ref,
    many
}

export interface EntityAssociation {
    type: RelationType;
    model: ModelType;

    extractId(json: any): number | string | (number | string)[];
}

const getModel = (modelName: string): ModelType => {
    if (modelTypeMap[modelName] == null) {
        throw `${modelName} is not registered in the store`;
    }
    return modelTypeMap[modelName];
};

export const ref = (modelName: string): EntityAssociation => {
    if (!modelName)
        throw "model is undefined";

    return {
        type: RelationType.ref,
        get model(): ModelType {
            return getModel(modelName);
        },
        extractId: (json: any) => {
            if (!json)
                return null;
            return json[getModel(modelName).schema.__id]
        }
    };
};
export const many = (modelName: string): EntityAssociation => {
    if (!modelName)
        throw "model is undefined";

    return {
        type: RelationType.many,
        get model(): ModelType {
            return getModel(modelName);
        },
        extractId: (arr: Array<any>) => {
            return arr.map((json: any) => <number | string>ref(modelName).extractId(json))
                .filter(i => i != null)
        }
    }
};