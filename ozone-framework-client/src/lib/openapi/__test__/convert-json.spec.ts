import "reflect-metadata";

import { Model, Property } from "../decorators";
import { convertToJsonSchema, resetSchemaCache } from "../convert-json";
import { resetDefaultComponentContainer } from "../container";


describe("convertToJson", () => {

    beforeEach(() => {
        resetSchemaCache();
        resetDefaultComponentContainer();
    });

    it("deeply nested references", () => {
        @Model()
        class Class3 {
            @Property()
            id: number;
        }

        @Model()
        class Class2 {
            @Property()
            three: Class3;
        }

        @Model()
        class Class1 {
            @Property()
            two: Class2;
        }

        const schema = convertToJsonSchema(Class1);

        expect(schema).toEqual({
            type: "object",
            required: [
                "two"
            ],
            additionalProperties: false,
            properties: {
                two: { $ref: "#/definitions/Class2" }
            },
            definitions: {
                Class2: {
                    type: "object",
                    required: [
                        "three"
                    ],
                    additionalProperties: false,
                    properties: {
                        three: { $ref: "#/definitions/Class3" }
                    }
                },
                Class3: {
                    type: "object",
                    required: [
                        "id"
                    ],
                    additionalProperties: false,
                    properties: {
                        id: { type: "number" }
                    }
                }
            }
        });
    });

    it("nullable reference", () => {
        @Model()
        class Class2 {
            @Property()
            id: number;
        }

        @Model()
        class Class1 {
            @Property({ nullable: true })
            two?: Class2;
        }

        const schema = convertToJsonSchema(Class1);

        expect(schema).toEqual({
            type: "object",
            required: [
                "two"
            ],
            additionalProperties: false,
            properties: {
                two: {
                    oneOf: [
                        { $ref: "#/definitions/Class2" },
                        { type: "null" }
                    ]
                }
            },
            definitions: {
                Class2: {
                    type: "object",
                    required: [
                        "id"
                    ],
                    additionalProperties: false,
                    properties: {
                        id: { type: "number" }
                    }
                },
            }
        });
    });

    it("reference array", () => {
        @Model()
        class Class2 {
            @Property()
            id: number;
        }

        @Model()
        class Class1 {
            @Property(() => Class2)
            two: Class2[];
        }

        const schema = convertToJsonSchema(Class1);

        expect(schema).toEqual({
            type: "object",
            required: [
                "two"
            ],
            additionalProperties: false,
            properties: {
                two: {
                    type: "array",
                    items: { $ref: "#/definitions/Class2" },
                }
            },
            definitions: {
                Class2: {
                    type: "object",
                    required: [
                        "id"
                    ],
                    additionalProperties: false,
                    properties: {
                        id: { type: "number" }
                    }
                },
            }
        });
    });

    it("nullable reference array", () => {
        @Model()
        class Class2 {
            @Property()
            id: number;
        }

        @Model()
        class Class1 {
            @Property(() => Class2, { nullable: true })
            two?: Class2[];
        }

        const schema = convertToJsonSchema(Class1);

        expect(schema).toEqual({
            type: "object",
            required: [
                "two"
            ],
            additionalProperties: false,
            properties: {
                two: {
                    oneOf: [
                        {
                            type: "array",
                            items: { $ref: "#/definitions/Class2" }
                        },
                        { type: "null" }
                    ]
                }
            },
            definitions: {
                Class2: {
                    type: "object",
                    required: [
                        "id"
                    ],
                    additionalProperties: false,
                    properties: {
                        id: {
                            type: "number"
                        }
                    }
                },
            }
        });
    });

});
