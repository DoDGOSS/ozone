import "reflect-metadata";

import { omit } from "lodash";

import {
    GroupCreateResponse,
    GroupDeleteResponse,
    GroupDTO,
    GroupGetResponse,
    GroupUpdateResponse
} from "../group-dto";

import { GROUPS } from "../../__test__/data";
import { expectSuccessfulValidation, expectToThrow } from "../../__test__/assertions";


describe("GroupDTO validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const group = GROUPS[0];

            const result = GroupDTO.validate(group);

            expect(result).toBeDefined();
        });

        test("missing 'id' throws error", () => {
            const group = omit(GROUPS[0], "id");

            const ex = expectToThrow(() => GroupDTO.validate(group));

            expect(ex.errors).toMatchObject([{
                params: { missingProperty: "id" }
            }]);
        });

    });

});


describe("GroupGetResponse validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                results: GROUPS.length,
                data: GROUPS
            };

            expectSuccessfulValidation(() =>
                GroupGetResponse.validate(response));
        });

    });

});


describe("GroupCreateResponse validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [GROUPS[0]]
            };

            expectSuccessfulValidation(() =>
                GroupCreateResponse.validate(response));
        });

    });

});


describe("GroupUpdateResponse validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [GROUPS[0]]
            };

            expectSuccessfulValidation(() =>
                GroupUpdateResponse.validate(response));
        });

    });

});


describe("GroupDeleteResponse validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [{ id: 1 }]
            };

            expectSuccessfulValidation(() =>
                GroupDeleteResponse.validate(response));
        });

    });

});

