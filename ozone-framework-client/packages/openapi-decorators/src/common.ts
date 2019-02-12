import { isNil } from "lodash";

import ajv, { Ajv, ErrorObject, ValidateFunction } from "ajv";

import { Type, Validator } from "./interfaces";
import { ValidationError } from "./errors";

import { convertToJsonSchema, convertToJsonSchemaArray } from "./convert-json";


export function createValidator<T>(component: Type<T>): Validator<T> {
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

export function createArrayValidator<T>(component: Type<T>): Validator<T[]> {
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
