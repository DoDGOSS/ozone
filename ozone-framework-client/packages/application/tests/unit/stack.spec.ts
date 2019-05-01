import { expectValidationSuccess } from "./assertions";
import { validateStackDeleteUserResponse, validateStackGetResponse } from "../../src/api/models/StackDTO";
import { STACK_DELETE_USER_RESPONSE } from "./delete-stack.data";
import { GET_STACKS_RESPONSE } from "./get-stacks.data";
import { GET_STACK_BY_ID_RESPONSE } from "./get-stack-by-id.data";

describe("Stack", () => {
    it("GetStacksResponse - getStacks", () => {
        expectValidationSuccess(validateStackGetResponse, GET_STACKS_RESPONSE);
    });

    it("GetStacksResponse - getStackById", () => {
        expectValidationSuccess(validateStackGetResponse, GET_STACK_BY_ID_RESPONSE);
    });

    it("StackDeleteUserResponse", () => {
        expectValidationSuccess(validateStackDeleteUserResponse, STACK_DELETE_USER_RESPONSE);
    });
});
