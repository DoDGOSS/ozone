import * as ajv from "ajv";
import { Ajv, ErrorObject, ValidateFunction } from "ajv";

import { isNil } from "lodash";

import { ValidationError } from "./errors";
import { Validator } from "./interfaces";
import { Type } from "../interfaces";
import { convertToJsonSchema } from "../lib/openapi/convert-json";

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

    // non-standard, for OAS3
    components?: any;
}

export function createLazyComponentValidator<T>(component: Type<T>): Validator<T> {
    let validate: ValidateFunction;

    return (data: any) => {
        if (!validate) {
            validate = getAjv().compile(convertToJsonSchema(component));
        }

        const valid = validate(data);
        if (!valid) {
            const errors = formatValidationErrors(validate.errors);
            throw new ValidationError(`${component.name} Validation Error: ${errors}`, validate.errors);
        }
        return data as T;
    };
}

let ajvInstance: Ajv;

function getAjv(): Ajv {
    if (!ajvInstance) {
        ajvInstance = new ajv({ allErrors: true });
    }
    return ajvInstance;
}

function formatValidationErrors(errors: ErrorObject[] | null | undefined): string {
    if (isNil(errors)) return "Unknown validation error";

    return errors.map(e => `${e.schemaPath} - ${e.message}`).join("; ");
}
