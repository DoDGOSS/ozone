import "reflect-metadata";

import { omit } from "lodash";

import { UserCreateResponse, UserDeleteResponse, UserDTO, UserGetResponse, UserUpdateResponse } from "../user-dto";

import { USERS } from "../../__test__/data";
import { expectSuccessfulValidation, expectToThrow } from "../../__test__/assertions";


describe("UserDTO validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const user = USERS[0];

            const result = UserDTO.validate(user);

            expect(result).toBeDefined();
        });

        test("missing 'id' throws error", () => {
            const user = omit(USERS[0], "id");

            const ex = expectToThrow(() => UserDTO.validate(user));

            expect(ex.errors).toMatchObject([{
                params: { missingProperty: "id" }
            }]);
        });

    });

});


describe("UserGetResponse validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                results: 2,
                data: USERS
            };

            expectSuccessfulValidation(() =>
                UserGetResponse.validate(response));
        });

    });

});


describe("UserCreateResponse validation", () => {

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

});


describe("UserUpdateResponse validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [USERS[0]]
            };

            expectSuccessfulValidation(() => UserUpdateResponse.validate(response));
        });

    });

});


describe("UserDeleteResponse validation", () => {

    describe("validate", () => {

        test("is valid", () => {
            const response = {
                success: true,
                data: [{ id: 1 }]
            };

            expectSuccessfulValidation(() => UserDeleteResponse.validate(response));
        });

    });

});

