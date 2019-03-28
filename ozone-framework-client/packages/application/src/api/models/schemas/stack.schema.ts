import { GROUP_SCHEMA } from "./group.schema";
import { ID_SCHEMA } from "./common.schema";

export const STACK_SCHEMA = {
    title: "Stack",
    type: "object",
    required: [
        "approved",
        "defaultGroup",
        "description",
        "descriptorUrl",
        "groups",
        "id",
        "imageUrl",
        "name",
        "owner",
        "stackContext",
        "totalDashboards",
        "totalGroups",
        "totalUsers",
        "totalWidgets"
    ],
    additionalProperties: false,
    properties: {
        approved: {
            type: "boolean"
        },
        defaultGroup: {
            $ref: "#/definitions/Group"
        },
        description: {
            type: ["string", "null"]
        },
        descriptorUrl: {
            type: ["string", "null"]
        },
        groups: {
            type: "array" // TODO
        },
        id: {
            type: "number"
        },
        imageUrl: {
            type: ["string", "null"]
        },
        name: {
            type: "string"
        },
        owner: {
            oneOf: [
                {
                    type: "object",
                    require: ["username"],
                    additionalProperties: false,
                    properties: {
                        username: {
                            type: "string"
                        }
                    }
                },
                { type: "null" }
            ]
        },
        stackContext: {
            type: "string"
        },
        totalDashboards: {
            type: "number"
        },
        totalGroups: {
            type: "number"
        },
        totalUsers: {
            type: "number"
        },
        totalWidgets: {
            type: "number"
        }
    },
    definitions: {
        Group: GROUP_SCHEMA
    }
};

export const STACK_GET_RESPONSE_SCHEMA = {
    title: "StackGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Stack"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        Stack: STACK_SCHEMA,
        ...STACK_SCHEMA.definitions
    }
};

export const STACK_CREATE_RESPONSE_SCHEMA = {
    title: "StackCreateResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Stack"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Stack: STACK_SCHEMA,
        ...STACK_SCHEMA.definitions
    }
};

export const STACK_UPDATE_RESPONSE_SCHEMA = {
    ...STACK_CREATE_RESPONSE_SCHEMA,
    title: "StackUpdateResponse"
};

export const STACK_DELETE_RESPONSE_SCHEMA = {
    title: "StackDeleteResponse",
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
