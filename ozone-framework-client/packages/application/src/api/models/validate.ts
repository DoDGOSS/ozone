import ajv, { Ajv, ErrorObject, ValidateFunction } from "ajv";
import { isNil } from "lodash";

import { ValidationError } from "../errors";

export function createValidator<T>(schema: any): Validator<T> {
    let validate: ValidateFunction;

    return (data: any) => {
        if (!validate) {
            validate = getAjv().compile(schema);
        }

        const valid = validate(data);
        if (!valid) {
            const errors = formatValidationErrors(validate.errors);
            throw new ValidationError(`${schema.title} Validation Error: ${errors}`, validate.errors);
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

    return errors.map((e) => `${e.schemaPath} - ${e.message}`).join("; ");
}

export interface Type<T> extends Function {
    // tslint:disable-next-line:callable-types
    new (...args: any[]): T;
}

export type Validator<T> = (data: any) => T;
