import { Option } from "space-lift";

import { ModelMetadata, PropertyMap, PropertyMetadata } from "./metadata";

const DESIGN_TYPE = "design:type";

const MODEL_METADATA = Symbol("model:metadata");
const MODEL_PROPERTIES = Symbol("model:properties");


export function getDesignType(target: object, key: string | symbol): any {
    return Reflect.getMetadata(DESIGN_TYPE, target, key);
}

export function getPrimitiveTypeName(type: Function): string {
    switch (type) {
        case String:
            return "string";
        case Number:
            return "number";
        case Boolean:
            return "boolean";
        case Array:
            return "array";
        case undefined:
            return "null";
        default:
            return "object";
    }
}

export function getModelMetadata(target: Function): ModelMetadata | undefined {
    return Reflect.getMetadata(MODEL_METADATA, target);
}

export function setModelMetadata(target: Function, metadata: ModelMetadata): void {
    Reflect.defineMetadata(MODEL_METADATA, metadata, target);
}

export function hasModelProperties(target: Function): boolean {
    return Reflect.hasMetadata(MODEL_PROPERTIES, target);
}

export function getModelProperties(target: Function): PropertyMap {
    return Reflect.getMetadata(MODEL_PROPERTIES, target);
}

export function getPropertyMetadata(target: Function, propertyName: string): PropertyMetadata {
    const properties = getModelProperties(target);
    return properties && properties[propertyName];
}


export function setModelProperties(target: Function, properties: PropertyMap): void {
    Reflect.defineMetadata(MODEL_PROPERTIES, properties, target);
}

export function deleteModelMetadata(target: Function): void {
    Reflect.deleteMetadata(MODEL_METADATA, target);
}

export function deleteModelProperties(target: Function): void {
    Reflect.deleteMetadata(MODEL_PROPERTIES, target);
}

export function getReferencedType(property: PropertyMetadata): Function | undefined {
    return Option(property.typeProvider).map(typeProvider => typeProvider())
                                        .orElse(() => Option(property.type))
                                        .get();
}

export function getReferencedTypeMetadata(property: PropertyMetadata): ModelMetadata | undefined {
    return Option(getReferencedType(property)).map(getModelMetadata).get();
}
