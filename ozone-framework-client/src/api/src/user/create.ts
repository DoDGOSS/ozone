import * as Ajv from "ajv";

import { ValidationError } from "../errors";
import { composeSchemas } from "../schemas";

import { USER_SCHEMA, USER_SCHEMA_REF, UserDTO } from "./schema";


export interface UserCreateRequest {
    username: string;
    userRealName: string;
    email: string;
}

export interface UserCreateResponse {
    success: boolean;
    data: UserDTO[];
}

export const USER_CREATE_RESPONSE_SCHEMA = {
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
                $ref: USER_SCHEMA_REF
            }
        }
    }
};

export function validateCreateUserResponse(data: any): UserCreateResponse {
    const ajv = new Ajv({ allErrors: true });

    const schema = composeSchemas(USER_CREATE_RESPONSE_SCHEMA, { User: USER_SCHEMA });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        throw new ValidationError("UserCreateResponse", validate.errors);
    }

    return data as UserCreateResponse;
}
