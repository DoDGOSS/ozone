import { isArray, isNil, isUndefined } from "lodash";

import ajv from "ajv";
import { Ajv, ErrorObject, ValidateFunction } from "ajv";

import { Type } from "../interfaces";
import { Validator } from "./interfaces";
import { ValidationError } from "./errors";

import { convertToJsonSchema, convertToJsonSchemaArray } from "../lib/openapi/convert-json";


export function toArray<T>(value: T | T[]): T[] {
    if (isUndefined(value)) return [];
    if (isArray(value)) return value;

    return [value];
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

export function createLazyComponentArrayValidator<T>(component: Type<T>): Validator<T[]> {
    let validate: ValidateFunction;

    return (data: any) => {
        if (!validate) {
            validate = getAjv().compile(convertToJsonSchemaArray(component));
        }

        const valid = validate(data);
        if (!valid) {
            const errors = formatValidationErrors(validate.errors);
            throw new ValidationError(`${component.name} Validation Error: ${errors}`, validate.errors);
        }
        return data as T[];
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
