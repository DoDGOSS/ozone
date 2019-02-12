import { values } from "lodash";

import { ModelOptions, PropertyOptions } from "./interfaces";

export type PropertyMap = { [key: string]: PropertyMetadata };


export function isModelMetadata(value: any): value is ModelMetadata {
    return value instanceof ModelMetadata;
}

export class ModelMetadata {
    readonly target: Function;
    readonly targetName: string;
    readonly properties: { [key: string]: PropertyMetadata };
    readonly options?: ModelOptions;

    constructor(target: Function, properties: PropertyMap, options?: ModelOptions) {
        this.target = target;
        this.targetName = target.name;
        this.properties = properties;
        this.options = options;
    }

    get name(): string {
        return (this.options && this.options.name) ? this.options.name : this.targetName;
    }

    getProperties(): PropertyMetadata[] {
        return values(this.properties);
    }

}

export class PropertyMetadata {
    readonly key: string;
    readonly type: any;
    readonly typeProvider?: () => Function;
    readonly options?: PropertyOptions;

    constructor(key: string, type: any, typeProvider?: () => Function, options?: PropertyOptions) {
        this.key = key;
        this.type = type;
        this.typeProvider = typeProvider;
        this.options = options;
    }

}

