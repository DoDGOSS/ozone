import * as Ajv from "ajv";

import { ValidationError } from "../errors";
import { JsonSchema } from "../schemas";


export interface UserDTO {
    id: number;

    username: string;
    userRealName: string;
    email: string;

    lastLogin: any | null;
    hasPWD: null;

    totalDashboards: number;
    totalStacks: number;
    totalGroups: number;
    totalWidgets: number;
}

export const USER_SCHEMA_REF = "#/components/schemas/User";

export const USER_SCHEMA: JsonSchema<UserDTO> = {
    type: "object",
    required: [
        "email",
        "hasPWD",
        "id",
        "lastLogin",
        "totalDashboards",
        "totalGroups",
        "totalStacks",
        "totalWidgets",
        "username",
        "userRealName"
    ],
    additionalProperties: false,
    properties: {
        email: {
            type: "string"
        },
        hasPWD: {
            type: ["string", "null"]
        },
        id: {
            type: "number"
        },
        lastLogin: {
            type: ["string", "null"]
        },
        totalDashboards: {
            type: "number"
        },
        totalGroups: {
            type: "number"
        },
        totalStacks: {
            type: "number"
        },
        totalWidgets: {
            type: "number"
        },
        username: {
            type: "string"
        },
        userRealName: {
            type: "string"
        }
    }
};

export function validateUser(data: any): UserDTO {
    const ajv = new Ajv({ allErrors: true });

    const validate = ajv.compile(USER_SCHEMA);
    const valid = validate(data);
    if (!valid) {
        throw new ValidationError("UserDTO", validate.errors);
    }

    return data as UserDTO;
}
