import {
    ComponentMetadata,
    HasPropertyMetadata,
    isResponseMetadata,
    isSchemaMetadata,
    PropertyMetadata
} from "./metadata";
import { ComponentType, getComponentMetadata } from "./reflect";
import { JsonSchema } from "./json-schema";

import { isNil } from "./util";


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

        // TODO: Cleanup?
        if (property.type === "array" && !isNil(property.typeProvider)) {
            const itemComponent = getProvidedTypeMetadata(property);
            if (!isNil(itemComponent)) {
                const itemsSchema = getArrayItemsSchema(itemComponent);
                if (!isNil(itemsSchema)) {
                    propertySchema.items = itemsSchema;
                    if (isSchemaMetadata(itemComponent)) {
                        schema.addSchema(itemComponent.name, convertToJsonSchema(itemComponent.target));
                    }
                }
            }
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

function getSortedPropertyMetadata(componentMetadata: ComponentMetadata & HasPropertyMetadata): PropertyMetadata[] {
    const properties = componentMetadata.getProperties();
    properties.sort((a, b) => {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
    });
    return properties;
}

function getProvidedTypeMetadata(property: PropertyMetadata): ComponentMetadata | undefined {
    if (isNil(property.typeProvider)) return undefined;

    const component = property.typeProvider();
    if (component === undefined) return undefined;

    return getComponentMetadata(component);
}

function getArrayItemsSchema(componentMetadata: ComponentMetadata) {
    switch (componentMetadata.type) {
        case ComponentType.SCHEMA:
            return {
                $ref: `#/components/schemas/${componentMetadata.name}`
            };
    }

    return undefined;
}
