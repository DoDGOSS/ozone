import { classNames } from "../../src/utility";

describe("classNames", () => {
    it("converts varargs", () => {
        expect(classNames("fizz", "buzz")).toEqual("fizz buzz");
    });

    it("converts object properties", () => {
        expect(classNames({ fizz: true, buzz: true })).toEqual("fizz buzz");
    });

    it("converts array of strings", () => {
        expect(classNames(["fizz", "buzz"])).toEqual("fizz buzz");
    });
});
