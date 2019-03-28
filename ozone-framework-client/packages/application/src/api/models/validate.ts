import ajv, { Ajv, ErrorObject, ValidateFunction } from "ajv";
import { isNil } from "lodash";

import { ValidationError } from "../errors";
import { Validator } from "../interfaces";

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
