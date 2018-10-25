import * as _ from "lodash";

import { validateUser } from "./schema";
import { validateUserResponse } from "./get";

import { expectToThrow } from "../../test/assertions";
import { USERS } from "../../test/data";


describe("UserDTO validation", () => {

    test("validateUser - valid", () => {
        const user = USERS[0];

        const result = validateUser(user);

        expect(result).toBeDefined();
    });

    test("validateUser - missing 'id'", () => {
        const user = _.omit(USERS[0], "id");

        const ex = expectToThrow(() => validateUser(user));

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

        const result = validateUserResponse(response);
        expect(result).toBeDefined();
    });

});

