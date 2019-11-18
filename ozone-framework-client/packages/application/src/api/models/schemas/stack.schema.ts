import { GROUP_SCHEMA } from "./group.schema";
import { USER_SCHEMA } from "./user.schema";

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
        "stackContext"
        // TODO -- add in django
        // "totalDashboards",
        // "totalGroups",
        // "totalUsers",
        // "totalWidgets"
    ],
    additionalProperties: true,
    properties: {
        approved: {
            type: ["boolean", "null"]
        },
        defaultGroup: {
            type: ["number", "null"]
        },
        description: {
            type: ["string", "null"]
        },
        descriptorUrl: {
            type: ["string", "null"]
        },
        groups: {
            type: "array",
            items: {
                $ref: "#/definitions/Group"
            }
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
            oneOf: [{ $ref: "#/definitions/User" }, { type: "null" }]
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
        Group: GROUP_SCHEMA,
        User: USER_SCHEMA
    }
};

export const STACK_GET_RESPONSE_SCHEMA = {
    title: "StackGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: true,
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

export const STACK_USER_GET_RESPONSE_SCHEMA = {
    title: "StackUserGetResponse",
    type: "object",
    required: ["stacks", "user"],
    additionalProperties: true,
    properties: {
        stacks: {
            anyOf: [
                {
                    type: "array"
                },
                {
                    type: "array",
                    items: {
                        $ref: "#/definitions/Stack"
                    }
                }
            ]
        },
        user: {
            $ref: "#/definitions/User"
        }
    },
    definitions: {
        Stack: STACK_SCHEMA,
        ...STACK_SCHEMA.definitions
    }
};

export const STACK_GROUP_GET_RESPONSE_SCHEMA = {
    title: "StackGroupGetResponse",
    type: "object",
    required: ["stack", "group"],
    additionalProperties: true,
    properties: {
        stack: {
            $ref: "#/definitions/Stack"
        },
        group: {
            $ref: "#/definitions/Group"
        }
    },
    definitions: {
        Stack: STACK_SCHEMA,
        ...STACK_SCHEMA.definitions
    }
};
