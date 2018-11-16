import { JsonSchema } from "./json-schema";

import {
    ComponentMetadata,
    HasPropertyMetadata,
    isResponseMetadata,
    isSchemaMetadata,
    PropertyMetadata
} from "./metadata";

import { ComponentType, getComponentMetadata, getPrimitiveTypeName } from "./reflect";

import { isNil } from "lodash";


const SCHEMA_CACHE: { [name: string]: any } = {};
const RESPONSES_CACHE: { [name: string]: any } = {};


export function convertToJsonSchema(component: Function) {
    const componentMetadata = getComponentMetadata(component);

    const targetName = componentMetadata.targetName;
    if (isSchemaMetadata(componentMetadata)) {
        if (targetName in SCHEMA_CACHE) {
            return SCHEMA_CACHE[targetName];
        }
    } else if (isResponseMetadata(componentMetadata)) {
        if (targetName in RESPONSES_CACHE) {
            return RESPONSES_CACHE[targetName];
        }
    } else {
        throw new Error(`Unable to convert to JSON schema; invalid component type '${componentMetadata.type}'`);
    }

    const schema = new JsonSchema("object");
    schema.additionalProperties = false;

    const properties = getSortedPropertyMetadata(componentMetadata);

    for (const property of properties) {
        const propertySchema: any = {};
        const propertyOptions = property.options || {};

        if (propertyOptions.required !== false) {
            schema.addRequired(property.key);
        }

        if (propertyOptions.nullable === true) {
            propertySchema.type = [property.type, "null"];
        } else {
            propertySchema.type = property.type;
        }

        if (!isNil(propertyOptions.enum)) {
            propertySchema.enum = propertyOptions.enum;
        }

        if (property.type === "array") {
            addArrayItemsSchema(schema, propertySchema, property);
        }

        schema.addProperty(property.key, propertySchema);
    }

    const plainSchema = schema.toJSON();

    if (isSchemaMetadata(componentMetadata)) {
        SCHEMA_CACHE[targetName] = plainSchema;
    } else if (isResponseMetadata(componentMetadata)) {
        RESPONSES_CACHE[targetName] = plainSchema;
    }

    return plainSchema;
}

function addArrayItemsSchema(schema: JsonSchema, propertySchema: any, property: PropertyMetadata): void {
    if (isNil(property.typeProvider)) return;

    const providedType = property.typeProvider();
    if (isNil(providedType)) return;

    const itemMetadata = getComponentMetadata(providedType);
    if (!isNil(itemMetadata)) {
        switch (itemMetadata.type) {
            case ComponentType.SCHEMA:
                propertySchema.items = { $ref: `#/components/schemas/${itemMetadata.name}` };
                schema.addSchema(itemMetadata.name, convertToJsonSchema(itemMetadata.target));
                break;
            case ComponentType.RESPONSE:
                propertySchema.items = { $ref: `#/components/responses/${itemMetadata.name}` };
                break;
        }
        return;
    }

    const primitiveType = getPrimitiveTypeName(providedType);
    if (isNil(primitiveType)) return;

    propertySchema.items = {type: primitiveType};
}

function getSortedPropertyMetadata(componentMetadata: ComponentMetadata & HasPropertyMetadata): PropertyMetadata[] {
    const properties = componentMetadata.getProperties();
    properties.sort((a, b) => {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
    });
    return properties;
}
