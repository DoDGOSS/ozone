export const AUTH_GROUP_SCHEMA = {
    title: "AuthGroup",
    type: "object",
    required: ["automatic", "description", "displayName", "email", "id", "name", "status"],
    additionalProperties: true,
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
        status: {
            type: "string",
            enum: ["active", "inactive"]
        }
    }
};

export const AUTH_USER_SCHEMA = {
    title: "AuthUser",
    type: "object",
    required: ["email", "groups", "id", "isAdmin", "roles", "theme", "userRealName", "username"],
    additionalProperties: true,
    properties: {
        email: {
            type: ["string", "null"]
        },
        groups: {
            type: "array",
            items: {
                $ref: "#/definitions/AuthGroup"
            }
        },
        id: {
            type: "number"
        },
        isAdmin: {
            type: "boolean"
        },
        theme: {
            type: "string"
        },
        roles: {
            type: "array",
            items: {
                type: "string"
            }
        },
        userRealName: {
            type: "string"
        },
        username: {
            type: "string"
        }
    },
    definitions: {
        AuthGroup: AUTH_GROUP_SCHEMA
    }
};
