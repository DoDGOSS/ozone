import "reflect-metadata";


import { getDefaultComponentContainer } from "../../../lib/openapi/container";
import { convertToJsonSchema } from "../../../lib/openapi/convert-json";

import { AuthUserDTO } from "../auth-dto";


describe("AuthUserDTO", () => {

    describe("metadata", () => {

        const metadata = getDefaultComponentContainer().getSchema(AuthUserDTO);

        it("has property 'roles'", () => {
            const property = metadata.properties["roles"];

            expect(property).toEqual({
                key: "roles",
                type: "array",
                typeProvider: expect.any(Function),
            });

            expect(property.typeProvider!()).toEqual(String);
        });
    });

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(AuthUserDTO)).toEqual(AUTH_USER_JSON_SCHEMA);
        });

    });

});

const AUTH_USER_JSON_SCHEMA = {
    type: "object",
    required: [
        "email",
        "groups",
        "id",
        "isAdmin",
        "roles",
        "userRealName",
        "username"
    ],
    additionalProperties: false,
    properties: {
        email: {
            type: ["string", "null"]
        },
        groups: {
            type: "array",
            items: {
                $ref: "#/components/schemas/AuthGroup"
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
    components: {
        schemas: {
            AuthGroup: {
                type: "object",
                required: [
                    "automatic",
                    "description",
                    "displayName",
                    "email",
                    "id",
                    "name",
                    "status"
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
                    status: {
                        type: "string",
                        enum: ["active", "inactive"]
                    }
                },
            }
        }
    }
};
