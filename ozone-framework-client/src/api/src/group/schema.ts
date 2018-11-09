import * as Ajv from "ajv";

import { ValidationError } from "../errors";
import { JsonSchema } from "../schemas";


export interface GroupDTO {
    id: number;

    name: string;
    displayName?: string;
    description?: string;
    email?: string;

    status: "active" | "inactive";
    stackDefault: boolean;
    automatic: boolean;

    totalStacks: number;
    totalUsers: number;
    totalWidgets: number;
}

export const GROUP_SCHEMA_REF = "#/components/schemas/Group";

export const GROUP_SCHEMA: JsonSchema<GroupDTO> = {
    type: "object",
    required: [
        "automatic",
        "description",
        "displayName",
        "email",
        "id",
        "name",
        "stackDefault",
        "status",
        "totalStacks",
        "totalUsers",
        "totalWidgets"
    ],
    additionalProperties: false,
    properties: {
        automatic: {
            type: "boolean"
        },
        description: {
            type: ["string", "null"]
        },
        displayName: {
            type: "string"
        },
        email: {
            type: ["string", "null"]
        },
        id: {
            type: "number"
        },
        name: {
            type: "string"
        },
        stackDefault: {
            type: "boolean"
        },
        status: {
            type: "string",
            enum: ["active", "inactive"]
        },
        totalUsers: {
            type: "number"
        },
        totalStacks: {
            type: "number"
        },
        totalWidgets: {
            type: "number"
        }
    }
};

export function validateGroup(data: any): GroupDTO {
    const ajv = new Ajv({ allErrors: true });

    const validate = ajv.compile(GROUP_SCHEMA);
    const valid = validate(data);
    if (!valid) {
        throw new ValidationError("GroupDTO", validate.errors);
    }

    return data as GroupDTO;
}
