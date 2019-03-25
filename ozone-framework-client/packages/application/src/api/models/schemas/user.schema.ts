import { ID_SCHEMA } from "./common.schema";

export const USER_SCHEMA = {
    title: "User",
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
        "userRealName",
        "username"
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
        userRealName: {
            type: "string"
        },
        username: {
            type: "string"
        }
    }
};

export const USER_GET_RESPONSE_SCHEMA = {
    title: "UserGetResponse",
    type: "object",
    required: ["data", "results", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/User"
            }
        },
        results: {
            type: "number"
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        User: USER_SCHEMA
    }
};

export const USER_CREATE_RESPONSE_SCHEMA = {
    title: "UserCreateResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/User"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        User: USER_SCHEMA
    }
};
export const USER_UPDATE_RESPONSE_SCHEMA = {
    ...USER_CREATE_RESPONSE_SCHEMA,
    title: "UserUpdateResponse"
};

export const USER_DELETE_RESPONSE_SCHEMA = {
    title: "UserDeleteResponse",
    type: "object",
    required: ["data", "success"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Id"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Id: ID_SCHEMA
    }
};
