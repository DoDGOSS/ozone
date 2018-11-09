export function composeSchemas(baseSchema: any, componentSchemas: any): any {
    return {
        ...baseSchema,
        ...{ components: { schemas: componentSchemas } }
    };
}

export type JsonSchemaType = "null" | "boolean" | "object" | "array" | "number" | "string" | "integer";

export interface JsonSchema<T> {
    type: JsonSchemaType | JsonSchemaType[];
    required?: Array<keyof T>;
    additionalProperties?: boolean;
    properties?: { [K in keyof T]: JsonSchema<any> };
    enum?: string[];
    items?: any;
}
