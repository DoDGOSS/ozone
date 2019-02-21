import "reflect-metadata";

import { omit } from "lodash";

import { convertToJsonSchema } from "@ozone/openapi-decorators";

import {
    GroupCreateResponse,
    GroupDeleteResponse,
    GroupDTO,
    GroupGetResponse,
    GroupUpdateResponse
} from "../../src/api";

import { expectSuccessfulValidation, expectToThrow } from "./assertions";
import { GROUPS } from "./data";

describe("GroupDTO", () => {
    describe("validate", () => {
        test("is valid", () => {
            const group = GROUPS[0];

            expectSuccessfulValidation(() => GroupDTO.validate(group));
        });

        test("missing 'id' throws error", () => {
            const group = omit(GROUPS[0], "id");

            const ex = expectToThrow(() => GroupDTO.validate(group));

            expect(ex.errors).toMatchObject([
                {
                    params: { missingProperty: "id" }
                }
            ]);
        });
    });

    describe("schema generation", () => {
        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(GroupDTO)).toEqual(GROUP_JSON_SCHEMA);
        });
    });
});

describe("GroupGetResponse", () => {
    describe("validate", () => {
        test("is valid", () => {
            const response = {
                results: GROUPS.length,
                data: GROUPS
            };

            expectSuccessfulValidation(() => GroupGetResponse.validate(response));
        });
    });

    describe("schema generation", () => {
        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(GroupGetResponse)).toEqual(GROUP_GET_RESPONSE_JSON_SCHEMA);
        });
    });
});

describe("GroupCreateResponse", () => {
    describe("validate", () => {
        test("is valid", () => {
            const response = {
                success: true,
                data: [GROUPS[0]]
            };

            expectSuccessfulValidation(() => GroupCreateResponse.validate(response));
        });
    });
});

describe("GroupUpdateResponse", () => {
    describe("validate", () => {
        test("is valid", () => {
            const response = {
                success: true,
                data: [GROUPS[0]]
            };

            expectSuccessfulValidation(() => GroupUpdateResponse.validate(response));
        });
    });
});

describe("GroupDeleteResponse", () => {
    describe("validate", () => {
        test("is valid", () => {
            const response = {
                success: true,
                data: [{ id: 1 }]
            };

            expectSuccessfulValidation(() => GroupDeleteResponse.validate(response));
        });
    });
});

const GROUP_JSON_SCHEMA = {
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

const GROUP_GET_RESPONSE_JSON_SCHEMA = {
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
        Group: GROUP_JSON_SCHEMA
    }
};
