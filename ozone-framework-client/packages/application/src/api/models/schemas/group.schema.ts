import { ID_SCHEMA } from "./common.schema";

export const GROUP_SCHEMA = {
    title: "Group",
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
            type: ["string", "null"]
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

export const GROUP_GET_RESPONSE_SCHEMA = {
    title: "GroupGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Group"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        Group: GROUP_SCHEMA
    }
};
export const GROUP_CREATE_RESPONSE_SCHEMA = {
    title: "GroupCreateResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Group"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Group: GROUP_SCHEMA
    }
};
export const GROUP_UPDATE_RESPONSE_SCHEMA = {
    ...GROUP_CREATE_RESPONSE_SCHEMA,
    title: "GroupUpdateResponse"
};

export const GROUP_DELETE_RESPONSE_SCHEMA = {
    title: "GroupDeleteResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/IdObject"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        IdObject: ID_SCHEMA
    }
};
