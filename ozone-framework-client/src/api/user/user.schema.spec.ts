import * as _ from "lodash";

import { validateUserDTO, validateUserGetResponse } from "./user.schema";

import { USERS } from "../__test__/data";
import { expectToThrow } from "../__test__/assertions";


describe("UserDTO validation", () => {

    test("validateUser - valid", () => {
        const user = USERS[0];

        const result = validateUserDTO(user);

        expect(result).toBeDefined();
    });

    test("validateUser - missing 'id'", () => {
        const user = _.omit(USERS[0], "id");

        const ex = expectToThrow(() => validateUserDTO(user));

        expect(ex.errors).toHaveLength(1);
        expect(ex.errors[0]).toMatchObject({
            params: { missingProperty: "id" }
        });
    });

    test("validateUserResponse - valid", () => {
        const response = {
            success: true,
            results: 2,
            data: USERS
        };

        const result = validateUserGetResponse(response);
        expect(result).toBeDefined();
    });

});

