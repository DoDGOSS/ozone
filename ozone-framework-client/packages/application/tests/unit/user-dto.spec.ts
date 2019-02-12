import "reflect-metadata";

import { omit } from "lodash";

import { convertToJsonSchema } from "@ozone/openapi-decorators";

import { UserCreateResponse, UserDeleteResponse, UserDTO, UserGetResponse, UserUpdateResponse } from "../../src/api";

import { expectSuccessfulValidation, expectToThrow } from "./assertions";
import { USERS } from "./data";


describe("UserDTO", () => {

    describe("validate", () => {

        test("is valid", () => {
            const user = USERS[0];

            expectSuccessfulValidation(() => UserDTO.validate(user));
        });

        test("missing 'id' throws error", () => {
            const user = omit(USERS[0], "id");

            const ex = expectToThrow(() => UserDTO.validate(user));

            expect(ex.errors).toMatchObject([{
                params: { missingProperty: "id" }
            }]);
        });

    });

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(UserDTO)).toEqual(USER_JSON_SCHEMA);
        });

    });

});


describe("UserGetResponse", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                results: 2,
                data: USERS
            };

            expectSuccessfulValidation(() => UserGetResponse.validate(response));
        });

    });

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(UserGetResponse)).toEqual(USER_GET_RESPONSE_JSON_SCHEMA);
        });

    });

});


describe("UserCreateResponse", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [USERS[0]]
            };

            expectSuccessfulValidation(() =>
                UserCreateResponse.validate(response));
        });

    });

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(UserCreateResponse)).toEqual(USER_CREATE_RESPONSE_JSON_SCHEMA);
        });

    });

});


describe("UserUpdateResponse", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [USERS[0]]
            };

            expectSuccessfulValidation(() => UserUpdateResponse.validate(response));
        });

    });

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(UserUpdateResponse)).toEqual(USER_UPDATE_RESPONSE_JSON_SCHEMA);
        });

    });

});


describe("UserDeleteResponse", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [{ id: 1 }]
            };

            expectSuccessfulValidation(() => UserDeleteResponse.validate(response));
        });

    });

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(UserDeleteResponse)).toEqual(USER_DELETE_RESPONSE_JSON_SCHEMA);
        });

    });


});


export const ID_JSON_SCHEMA = {
    type: "object",
    required: [
        "id"
    ],
    additionalProperties: false,
    properties: {
        id: {
            type: "number"
        }
    }
};


const USER_JSON_SCHEMA = {
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


const USER_GET_RESPONSE_JSON_SCHEMA = {
    type: "object",
    required: [
        "data",
        "results",
        "success"
    ],
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
        User: USER_JSON_SCHEMA
    }
};


const USER_CREATE_RESPONSE_JSON_SCHEMA = {
    type: "object",
    required: [
        "data",
        "success"
    ],
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
        User: USER_JSON_SCHEMA
    }
};


const USER_UPDATE_RESPONSE_JSON_SCHEMA = {
    type: "object",
    required: [
        "data",
        "success"
    ],
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
        User: USER_JSON_SCHEMA
    }
};


const USER_DELETE_RESPONSE_JSON_SCHEMA = {
    type: "object",
    required: [
        "data",
        "success"
    ],
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
        Id: ID_JSON_SCHEMA
    }
};
