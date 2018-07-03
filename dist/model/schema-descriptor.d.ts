import { ModelType } from "./base-model";
export declare enum RelationType {
    ref = 0,
    many = 1
}
export interface EntityAssociation {
    type: RelationType;
    model: ModelType;
    extractId(json: any): number | string | (number | string)[];
}
export declare const ref: (modelName: string) => EntityAssociation;
export declare const many: (modelName: string) => EntityAssociation;
