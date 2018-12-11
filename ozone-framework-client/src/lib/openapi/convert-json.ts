import { JsonSchemaBuilder } from "./json-schema-builder";

import { ModelMetadata, PropertyMetadata } from "./metadata";
import { getModelMetadata, getPrimitiveTypeName, getReferencedTypeMetadata } from "./reflect";

import { isEqual, isNil, keys } from "lodash";
import { invoke } from "./util";

let SCHEMA_CACHE: { [name: string]: any } = {};

export function resetSchemaCache(): void {
    SCHEMA_CACHE = {};
}

function getCachedSchema(metadata: ModelMetadata) {
    const modelName = metadata.name;
    return (modelName in SCHEMA_CACHE) ? SCHEMA_CACHE[modelName] : undefined;
}

function addCachedSchema(metadata: ModelMetadata, schema: any): void {
    const modelName = metadata.name;
    SCHEMA_CACHE[modelName] = schema;
}

export function convertToJsonSchema(model: Function) {
    const modelMetadata = getModelMetadata(model);

    if (isNil(modelMetadata)) {
        throw new Error(`Unable to convert to JSON schema; '${model.name}' is not defined as a Model`);
    }

    const cachedSchema = getCachedSchema(modelMetadata);
    if (!isNil(cachedSchema)) return cachedSchema;

    const schema = new JsonSchemaBuilder("object");
    schema.additionalProperties = false;

    const properties = getSortedPropertyMetadata(modelMetadata);

    // TODO: Needs refactoring
    for (const property of properties) {
        const propertyOptions = property.options || {};

        if (propertyOptions.required !== false) {
            schema.addRequired(property.key);
        }

        const primitiveType = getPrimitiveTypeName(property.type);

        let propertySchema: any;
        let metadata: ModelMetadata | undefined;
        if (primitiveType === "object") {
            [propertySchema, metadata] = getObjectReferenceSchema(property);
        } else if (primitiveType === "array") {
            [propertySchema, metadata] = getArraySchema(property);
        } else {
            propertySchema = { type: primitiveType };
        }

        if (!isNil(metadata)) {
            schema.addSchema(metadata.name, convertToJsonSchema(metadata.target));
        }

        if (!isNil(propertyOptions.enum)) {
            propertySchema.enum = propertyOptions.enum;
        }

        // Optionally add maxLength to string type definitions
        if (primitiveType === "string" && !isNil(propertyOptions.maxLength)) {
            propertySchema.maxLength = propertyOptions.maxLength;
        }

        if (propertyOptions.nullable) {
            // Use type array shorthand for definitions which only include a type
            if (isEqual(keys(propertySchema), ["type"])) {
                propertySchema.type = [primitiveType, "null"];
            } else {
                propertySchema = { oneOf: [propertySchema, { type: "null" }] };
            }
        }

        schema.addProperty(property.key, propertySchema);
    }

    const plainSchema = schema.toJSON();

    addCachedSchema(modelMetadata, plainSchema);

    return plainSchema;
}

export function convertToJsonSchemaArray(model: Function) {
    const metadata = getModelMetadata(model);

    if (isNil(metadata)) {
        throw new Error(`Unable to convert to JSON schema; '${model.name}' is not defined as a Model`);
    }

    const schema = new JsonSchemaBuilder("array");

    schema.addSchema(metadata.name, convertToJsonSchema(metadata.target));

    schema.items = {
        $ref: `#/definitions/${metadata.name}`
    };

    return schema.toJSON();
}

function getObjectReferenceSchema(property: PropertyMetadata): [any, ModelMetadata?] {
    const referenceMetadata = getReferencedTypeMetadata(property);

    if (isNil(referenceMetadata)) {
        return [{type: "object"}];
    }

    return [{$ref: `#/definitions/${referenceMetadata.name}`}, referenceMetadata];
}


function getArraySchema(property: PropertyMetadata): [any, ModelMetadata?] {
    const providedType = invoke(property.typeProvider);

    if (!providedType.isDefined()) {
        return [{ type: "array" }];
    }

    const itemMetadata = providedType.map(getModelMetadata);
    if (itemMetadata.isDefined()) {
        const metadata = itemMetadata.get();
        return [{
            type: "array",
            items: {
                $ref: `#/definitions/${metadata.name}`
            }
        }, metadata];
    }

    const primitiveType = providedType.map(getPrimitiveTypeName);

    if (!primitiveType.isDefined()) {
        return [{ type: "array"}];
    }

    return [{
        type: "array",
        items: {
            type: primitiveType.get()
        }
    }];
}

function getSortedPropertyMetadata(modelMetadata: ModelMetadata): PropertyMetadata[] {
    return modelMetadata.getProperties().sort(compareByProperty("key"));
}

type PropertyKeyOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

function compareByProperty<T>(propertyKey: PropertyKeyOfType<T, string | number>): (a: T, b: T) => number {
    return (a: T, b: T) => {
        const av = a[propertyKey];
        const bv = b[propertyKey];

        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
    };
}
