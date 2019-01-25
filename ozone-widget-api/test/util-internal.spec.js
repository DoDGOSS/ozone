/* global document */

require("../dist/owf-widget");

describe("Utility (internal) namespace [Ozone.util.internal]", () => {

    const _ = Ozone.util.internal;

    describe("isArray", () => {
        parameterized(
            (value, expected) => {
                expect(_.isArray(value)).toStrictEqual(expected);
                expect(owfdojo.isArray(value)).toStrictEqual(expected);
            },
            [
                ["empty array", [], true],
                ["array", [1, 2, 3], true],
                ["Array()", new Array(1, 2, 3), true],

                ["boolean", true, false],
                ["boolean", false, false],
                ["number", 1, false],
                ["string", "foo", false],
                ["String()", new String("foo"), false],
                ["empty object", {}, false],
                ["function", () => 1, false],
                ["null", null, null],
                ["undefined", undefined, undefined]
            ]
        );
    });

    describe("isFunction", () => {
        parameterized(
            (value, expected) => {
                expect(_.isFunction(value)).toStrictEqual(expected);
                expect(owfdojo.isFunction(value)).toStrictEqual(expected);
            },
            [
                ["arrow function", () => 1, true],
                ["named function", function foo () { return 1; }, true],

                ["empty array", [], false],
                ["array", [1, 2, 3], false],
                ["Array()", new Array(1, 2, 3), false],
                ["boolean", true, false],
                ["boolean", false, false],
                ["number", 1, false],
                ["string", "foo", false],
                ["String()", new String("foo"), false],
                ["empty object", {}, false],
                ["null", null, false],
                ["undefined", undefined, false]
            ]
        );
    });

    describe("isObject", () => {
        parameterized(
            (value, expected) => {
                expect(_.isObject(value)).toStrictEqual(expected);
                expect(owfdojo.isObject(value)).toStrictEqual(expected);
            },
            [
                ["arrow function", () => 1, true],
                ["named function", function foo () { return 1; }, true],
                ["empty array", [], true],
                ["array", [1, 2, 3], true],
                ["Array()", new Array(1, 2, 3), true],
                ["empty object", {}, true],
                ["null", null, true],
                ["String()", new String("foo"), true],

                ["boolean", true, false],
                ["boolean", false, false],
                ["number", 1, false],
                ["string", "foo", false],
                ["undefined", undefined, false]
            ]
        );
    });

    describe("isString", () => {
        parameterized(
            (value, expected) => {
                expect(_.isString(value)).toStrictEqual(expected);
                expect(owfdojo.isString(value)).toStrictEqual(expected);
            },
            [
                ["string", "foo", true],
                ["String()", new String("foo"), true],

                ["arrow function", () => 1, false],
                ["named function", function foo () { return 1; }, false],
                ["empty array", [], false],
                ["array", [1, 2, 3], false],
                ["Array()", new Array(1, 2, 3), false],
                ["empty object", {}, false],
                ["null", null, false],
                ["boolean", true, false],
                ["boolean", false, false],
                ["number", 1, false],
                ["undefined", undefined, false]
            ]
        );
    });

    describe("encodeQueryObject", () => {
        it("encodes string and string arrays", () => {
            const obj = {
                blah: "blah",
                multi: [
                    "thud",
                    "thonk"
                ]
            };

            expect(owfdojo.objectToQuery(obj)).toEqual("blah=blah&multi=thud&multi=thonk");
            expect(_.encodeQueryObject(obj)).toEqual("blah=blah&multi=thud&multi=thonk");
        })
    });

    describe("mixin", () => {
        it("foo", () => {
            const obj = {
                fizz: {
                    bang: "wizz"
                }
            };

            const obj2 = {
                fizz: {
                    buzz: "bar"
                }
            };

            expect(owfdojo.mixin(obj, obj2)).toEqual({
                fizz: {
                    buzz: "bar"
                }
            });

            expect(_.mixin(obj, obj2)).toEqual({
                fizz: {
                    buzz: "bar"
                }
            });
        })
    })

});


function parameterized(callback, parameters) {
    for (let param of parameters) {
        const [description, value, expected] = param;

        test(`${description}: ${JSON.stringify(value)} → ${JSON.stringify(expected)}`, () => {
            callback(value, expected);
        });
    }
}
