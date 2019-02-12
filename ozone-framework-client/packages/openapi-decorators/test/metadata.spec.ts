import "reflect-metadata";

import { getPropertyMetadata, getReferencedTypeMetadata } from "../src/reflect";
import { Model, Property } from "../src/decorators";
import { resetDefaultComponentContainer } from "../src/container";


describe("getPropertyMetadata", () => {

    it("primitive property", () => {
        class Test {
            @Property()
            property: string;
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: String
        });
    });

    it("nullable property", () => {
        class Test {
            @Property({ nullable: true })
            property?: string;
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: String,
            options: {
                nullable: true
            }
        });
    });

    it("readOnly property", () => {
        class Test {
            @Property({ readOnly: true })
            property: string;
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: String,
            options: {
                readOnly: true
            }
        });
    });

    it("nullable and readOnly property", () => {
        class Test {
            @Property({ nullable: true, readOnly: true })
            property?: string;
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: String,
            options: {
                nullable: true,
                readOnly: true
            }
        });
    });

    it("primitive array property with type provider", () => {
        class Test {
            @Property(() => String)
            property: string[];
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: Array,
            typeProvider: expect.any(Function),
        });

        expect(metadata.typeProvider!()).toEqual(String);
    });

    it("primitive enum property", () => {
        class Test {
            @Property({ enum: ["value1", "value2"] })
            property: "value1" | "value2";
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: String,
            options: {
                enum: ["value1", "value2"]
            }
        });
    });

    it("reference property", () => {
        class Reference {
            id: number;
        }

        class Test {
            @Property()
            property: Reference;
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: Reference
        });
    });

    it("reference array property", () => {
        class Reference {
            id: number;
        }

        class Test {
            @Property(() => Reference)
            property: Reference[];
        }

        const metadata = getPropertyMetadata(Test, "property");

        expect(metadata).toEqual({
            key: "property",
            type: Array,
            typeProvider: expect.any(Function)
        });

        expect(metadata.typeProvider!()).toEqual(Reference);
    });

});


describe ("getReferencedTypeMetadata", () => {

    beforeEach(() => {
        resetDefaultComponentContainer();
    });

    it("for reference array property with type provider", () => {
        @Model()
        class Reference {
            id: number;
        }

        @Model()
        class Test {
            @Property(() => Reference)
            property: Reference[];
        }

        const propertyMetadata = getPropertyMetadata(Test, "property");
        expect(propertyMetadata).toBeDefined();

        const referenceMetadata = getReferencedTypeMetadata(propertyMetadata);
        expect(referenceMetadata).toHaveProperty("target", Reference);
    });

    it("for reference property without type provider", () => {
        @Model()
        class Reference {
            id: number;
        }

        @Model()
        class Test {
            @Property()
            property: Reference;
        }

        const propertyMetadata = getPropertyMetadata(Test, "property");
        expect(propertyMetadata).toBeDefined();

        const referenceMetadata = getReferencedTypeMetadata(propertyMetadata);
        expect(referenceMetadata).toHaveProperty("target", Reference);
    });


});
