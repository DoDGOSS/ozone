import * as Ajv from "ajv";

import { ValidationError } from "../errors";
import { composeSchemas } from "../schemas";

import { USER_SCHEMA, USER_SCHEMA_REF, UserDTO } from "./schema";


export interface UserUpdateRequest {
    id: number;
    username: string;
    userRealName: string;
    email: string;
}


export interface UserUpdateResponse {
    success: boolean;
    data: UserDTO[];
}

export const USER_UPDATE_RESPONSE_SCHEMA = {
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

export function validateUserUpdateResponse(data: any): UserUpdateResponse {
    const ajv = new Ajv({ allErrors: true });

    const schema = composeSchemas(USER_UPDATE_RESPONSE_SCHEMA, { User: USER_SCHEMA });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        throw new ValidationError("UserUpdateResponse", validate.errors);
    }

    return data as UserUpdateResponse;
}
