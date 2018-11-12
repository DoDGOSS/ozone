import * as ajv from "ajv";
import { Ajv, ValidateFunction } from "ajv";
import { ValidationError } from "./errors";
import { Validator } from "./interfaces";

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

let ajvInstance: Ajv;

function getAjv(): Ajv {
    if (!ajvInstance) {
        ajvInstance = new ajv({ allErrors: true });
    }
    return ajvInstance;
}


export function createLazyValidator<T>(provideSchema: () => JsonSchema<T>): Validator<T> {
    let validate: ValidateFunction;

    return (data: any) => {
        if (!validate) {
            validate = getAjv().compile(provideSchema());
        }

        const valid = validate(data);
        if (!valid) {
            const message = validate.errors ? validate.errors.map(e => e.message).join("; ") : "Unknown validation error";
            throw new ValidationError(message, validate.errors);
        }
        return data as T;
    };
}
