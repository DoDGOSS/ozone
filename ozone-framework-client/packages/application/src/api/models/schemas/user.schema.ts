import { USER_WIDGET_SCHEMA } from "./user-dashboard.schema";

export const USER_SCHEMA = {
    title: "User",
    type: "object",
    required: [
        "userRealName",
        "username",
        "email",
        "id",
        "lastLogin"
        // TODO -- add in django
        // "hasPWD",
        // "totalDashboards",
        // "totalGroups",
        // "totalStacks",
        // "totalWidgets"
    ],
    additionalProperties: true,
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
        userRealName: {
            type: "string"
        },
        username: {
            type: "string"
        }
        // totalDashboards: {
        //     type: "number"
        // },
        // totalGroups: {
        //     type: "number"
        // },
        // totalStacks: {
        //     type: "number"
        // },
        // totalWidgets: {
        //     type: "number"
        // },
    }
};

export const USER_GET_RESPONSE_SCHEMA = {
    title: "UserGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: true,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/User"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        User: USER_SCHEMA
    }
};

export const USER_WIDGETS_GET_RESPONSE_SCHEMA = {
    title: "UserWidgetsGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: true,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/UserWidgets"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        UserWidgets: USER_WIDGET_SCHEMA,
        ...USER_WIDGET_SCHEMA.definitions
    }
};
