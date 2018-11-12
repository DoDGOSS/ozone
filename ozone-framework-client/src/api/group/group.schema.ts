import { Validator } from "../interfaces";

import { composeSchemas, createLazyValidator, JsonSchema } from "../schemas";

import { GroupDTO, GroupGetResponse } from "./group.dto";


export const validateGroupDTO: Validator<GroupDTO> =
    createLazyValidator(() => GROUP_SCHEMA);


export const validateGroupGetResponse: Validator<GroupGetResponse> =
    createLazyValidator(() => composeSchemas(GROUP_GET_RESPONSE_SCHEMA, { Group: GROUP_SCHEMA }));


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


export const GROUP_GET_RESPONSE_SCHEMA: JsonSchema<GroupGetResponse> = {
    type: "object",
    required: [
        "results",
        "data"
    ],
    additionalProperties: false,
    properties: {
        results: {
            type: "number"
        },
        data: {
            type: "array",
            items: {
                $ref: GROUP_SCHEMA_REF
            }
        }
    }
};
