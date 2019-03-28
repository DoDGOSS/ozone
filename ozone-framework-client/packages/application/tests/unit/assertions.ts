import { Validator } from "../../src/api/interfaces";
import { ValidationError } from "../../src/api/errors";

export function expectToThrow(callable: () => any): any {
    try {
        callable();
    } catch (ex) {
        return ex;
    }
    fail("Expected the function to throw an error.\nBut it didn't throw anything.");
}

export function expectSuccessfulValidation(callable: () => any): any {
    let result;

    try {
        result = callable();
    } catch (ex) {
        fail(`Error: ${ex.message}\n\n${JSON.stringify(ex, null, 4)}`);
    }

    expect(result).toBeDefined();
}

export function expectValidationSuccess(validate: Validator<any>, data: any): void {
    try {
        validate(data);
    } catch (ex) {
        if (ex instanceof ValidationError) {
            console.log(JSON.stringify(ex.errors, null, 4));
        }
        fail(ex);
    }
}
