import * as Ajv from "ajv";

import { ValidationError } from "../errors";
import { composeSchemas, JsonSchema } from "../schemas";

import { USER_SCHEMA, USER_SCHEMA_REF, UserDTO } from "./schema";


export interface UserGetResponse {
    success: boolean;
    results: number;
    data: UserDTO[];
}

export const USER_RESPONSE_SCHEMA: JsonSchema<UserGetResponse> = {
    type: "object",
    required: [
        "success",
        "results",
        "data"
    ],
    additionalProperties: false,
    properties: {
        success: {
            type: "boolean"
        },
        results: {
            type: "number"
        },
        data: {
            type: "array",
            items: {
                $ref: USER_SCHEMA_REF
            }
        }
    }
};

export function validateUserResponse(data: any): UserGetResponse {
    const ajv = new Ajv({ allErrors: true });

    const schema = composeSchemas(USER_RESPONSE_SCHEMA, { User: USER_SCHEMA });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        throw new ValidationError("UserGetResponse", validate.errors);
    }

    return data as UserGetResponse;
}
