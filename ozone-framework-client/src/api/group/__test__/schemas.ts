import { JsonSchema } from "../../schemas";

import { GroupDTO, GroupGetResponse } from "../group-dto";


export const GROUP_SCHEMA_REF = "#/components/schemas/Group";

export const GROUP_JSON_SCHEMA: JsonSchema<GroupDTO> = {
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


export const GROUP_GET_RESPONSE_JSON_SCHEMA: JsonSchema<GroupGetResponse> = {
    type: "object",
    required: [
        "data",
        "results"
    ],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: GROUP_SCHEMA_REF
            }
        },
        results: {
            type: "number"
        }
    },
    components: {
        schemas: {
            Group: GROUP_JSON_SCHEMA
        }
    }
};
