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
            oneOf: [
                {
                    $ref: "#/definitions/User"
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
        Group: GROUP_SCHEMA,
        User: USER_SCHEMA
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

export const STACK_DELETE_ADMIN_RESPONSE_SCHEMA = {
    title: "StackDeleteResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                type: "object",
                required: ["id"],
                additionalProperties: false,
                properties: {
                    id: {
                        type: "number"
                    }
                }
            }
        },
        success: {
            type: "boolean"
        }
    }
};

export const STACK_DELETE_USER_VIEW_SCHEMA = {
    title: "StackDeleteUserView",
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
        "uniqueWidgetCount"
    ],
    additionalProperties: false,
    properties: {
        approved: {
            type: "boolean"
        },
        defaultGroup: {
            oneOf: [
                {
                    type: "object",
                    require: ["id"],
                    additionalProperties: false,
                    properties: {
                        id: {
                            type: "number"
                        }
                    }
                },
                { type: "null" }
            ]
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
                    required: ["id"],
                    additionalProperties: false,
                    properties: {
                        id: {
                            type: "number"
                        }
                    }
                },
                { type: "null" }
            ]
        },
        stackContext: {
            type: "string"
        },
        uniqueWidgetCount: {
            type: "number"
        }
    }
};

export const STACK_DELETE_USER_RESPONSE_SCHEMA = {
    title: "StackDeleteUserResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/StackDeleteUserView"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        StackDeleteUserView: STACK_DELETE_USER_VIEW_SCHEMA
    }
};
