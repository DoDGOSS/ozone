import { SchemaMetadata } from "./metadata";

export function convertToOAS3Schema(componentMetadata: SchemaMetadata) {
    const properties = componentMetadata.getProperties();
    properties.sort((a, b) => {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
    });

    const schema: any = {
        type: "object",
        required: [],
        additionalProperties: false,  // TODO: Make optional
        properties: {}
    };

    for (const property of properties) {
        const propertySchema: any = {};
        const propertyOptions = property.options || {};

        if (propertyOptions.required !== false) {
            schema.required.push(property.key);
        }

        propertySchema.type = property.type;

        if (propertyOptions.nullable === true) {
            propertySchema.nullable = true;
        }

        if (propertyOptions.readOnly === true) {
            propertySchema.readOnly = true;
        }

        schema.properties[property.key] = propertySchema;
    }

    if (schema.required.length == 0) {
        delete schema.required;
    }

    return schema;
}
