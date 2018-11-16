import { PropertyOptions, ResponseOptions, SchemaOptions } from "./interfaces";
import { ComponentType } from "./reflect";

import { isNil, values } from "lodash";


export type PropertyMap = { [key: string]: PropertyMetadata };


export interface ComponentMetadata {
    readonly type: ComponentType;
    readonly target: Function;
    readonly targetName: string;
    readonly name: string;
}

export interface HasPropertyMetadata {
    readonly properties: { [key: string]: PropertyMetadata };

    getProperties(): PropertyMetadata[];
}

export class SchemaMetadata implements ComponentMetadata, HasPropertyMetadata {
    readonly type: ComponentType;
    readonly target: Function;
    readonly targetName: string;
    readonly properties: { [key: string]: PropertyMetadata };
    readonly options?: SchemaOptions;

    constructor(target: Function, properties: PropertyMap, options?: SchemaOptions) {
        this.type = ComponentType.SCHEMA;
        this.target = target;
        this.targetName = target.name;
        this.properties = properties;
        this.options = options;
    }

    getProperties(): PropertyMetadata[] {
        return values(this.properties);
    }

    get name(): string {
        return (this.options && this.options.name) ? this.options.name : this.targetName;
    }

}

export function isSchemaMetadata(metadata: ComponentMetadata | null | undefined): metadata is SchemaMetadata {
    return !isNil(metadata) && metadata.type === ComponentType.SCHEMA;
}

export function isResponseMetadata(metadata: ComponentMetadata | null | undefined): metadata is ResponseMetadata {
    return !isNil(metadata) && metadata.type === ComponentType.RESPONSE;
}


export class ResponseMetadata implements ComponentMetadata, HasPropertyMetadata {
    readonly type: ComponentType;
    readonly target: Function;
    readonly targetName: string;
    readonly properties: { [key: string]: PropertyMetadata };
    readonly options: ResponseOptions;

    constructor(target: Function, properties: PropertyMap, options: ResponseOptions) {
        this.type = ComponentType.RESPONSE;
        this.target = target;
        this.targetName = target.name;
        this.properties = properties;
        this.options = options;
    }

    getProperties(): PropertyMetadata[] {
        return values(this.properties);
    }

    get name(): string {
        return (this.options && this.options.name) ? this.options.name : this.targetName;
    }
}


export class PropertyMetadata {
    readonly key: string;
    readonly type: string;
    readonly typeProvider?: () => Function;
    readonly options?: PropertyOptions;

    constructor(key: string, type: string, typeProvider?: () => Function, options?: PropertyOptions) {
        this.key = key;
        this.type = type;
        this.typeProvider = typeProvider;
        this.options = options;
    }

}

