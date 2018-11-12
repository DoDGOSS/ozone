export function expectToThrow(callable: () => any): any {
    try {
        callable();
    } catch (ex) {
        return ex;
    }
    fail("Expected the function to throw an error.\nBut it didn't throw anything.");
}
