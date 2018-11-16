import { ComponentMetadata, PropertyMap } from "./metadata";

const DESIGN_TYPE = "design:type";

const COMPONENT_TYPE = Symbol("component:type");
const COMPONENT_METADATA = "component:metadata";
const COMPONENT_PROPERTIES = Symbol("component:properties");


export const enum ComponentType {
    SCHEMA = "Schema",
    RESPONSE = "Response"
}

export function getDesignTypeName(target: object, key: string | symbol): string | undefined {
    const type = Reflect.getMetadata(DESIGN_TYPE, target, key);

    switch (type) {
        case String: return "string";
        case Number: return "number";
        case Boolean: return "boolean";
        case Array: return "array";
        default: return "object";
    }
}

export function getPrimitiveTypeName(type: Function): string | undefined {
    switch (type) {
        case String: return "string";
        case Number: return "number";
        case Boolean: return "boolean";
        case Array: return "array";
    }
    return undefined;
}

export function getComponentType(target: Function): ComponentType | undefined {
    return Reflect.getMetadata(COMPONENT_TYPE, target);
}

export function setComponentType(target: Function, type: ComponentType): void {
    Reflect.defineMetadata(COMPONENT_TYPE, type, target);
}

export function getComponentMetadata(target: Function): ComponentMetadata {
    return Reflect.getMetadata(COMPONENT_METADATA, target);
}

export function setComponentMetadata(target: Function, metadata: ComponentMetadata ): void {
    Reflect.defineMetadata(COMPONENT_METADATA, metadata, target);
}

export function hasComponentProperties(target: Function): boolean {
    return Reflect.hasMetadata(COMPONENT_PROPERTIES, target);
}

export function getComponentProperties(target: Function): PropertyMap {
    return Reflect.getMetadata(COMPONENT_PROPERTIES, target);
}

export function setComponentProperties(target: Function, properties: PropertyMap): void {
    Reflect.defineMetadata(COMPONENT_PROPERTIES, properties, target);
}
