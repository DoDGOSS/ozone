import "reflect-metadata";

import { convertToJsonSchema } from "@ozone/openapi-decorators";

import { AuthUserDTO } from "../../src/api";

describe("AuthUserDTO", () => {
    describe("schema generation", () => {
        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(AuthUserDTO)).toEqual(AUTH_USER_JSON_SCHEMA);
        });
    });
});

const AUTH_GROUP_JSON_SCHEMA = {
    type: "object",
    required: ["automatic", "description", "displayName", "email", "id", "name", "status"],
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
        status: {
            type: "string",
            enum: ["active", "inactive"]
        }
    }
};

const AUTH_USER_JSON_SCHEMA = {
    type: "object",
    required: ["email", "groups", "id", "isAdmin", "roles", "userRealName", "username"],
    additionalProperties: false,
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
        AuthGroup: AUTH_GROUP_JSON_SCHEMA
    }
};
