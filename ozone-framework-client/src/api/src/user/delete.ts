import * as Ajv from "ajv";

import { ValidationError } from "../errors";


export interface UserDeleteResponse {
    success: boolean;
    data: Array<{ id: number }>;
}

export const USER_DELETE_RESPONSE_SCHEMA = {
    type: "object",
    required: [
        "success",
        "data"
    ],
    additionalProperties: false,
    properties: {
        success: {
            type: "boolean"
        },
        data: {
            type: "array",
            items: {
                type: "object",
                required: [
                    "id"
                ],
                additionalProperties: false,
                properties: {
                    id: {
                        type: "number"
                    }
                }
            }
        }
    }
};

export function validateUserDeleteResponse(data: any): UserDeleteResponse {
    const ajv = new Ajv({ allErrors: true });

    const validate = ajv.compile(USER_DELETE_RESPONSE_SCHEMA);
    const valid = validate(data);
    if (!valid) {
        throw new ValidationError("UserDeleteResponse", validate.errors);
    }

    return data as UserDeleteResponse;
}
