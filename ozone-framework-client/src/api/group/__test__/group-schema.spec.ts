import "reflect-metadata";

import { GroupDTO, GroupGetResponse } from "../group-dto";

import { getDefaultComponentContainer } from "../../../lib/openapi/container";
import { convertToJsonSchema } from "../../../lib/openapi/convert-json";

import { GROUP_GET_RESPONSE_JSON_SCHEMA, GROUP_JSON_SCHEMA } from "./schemas";


describe("GroupDTO", () => {

    describe("metadata", () => {

        const metadata = getDefaultComponentContainer().getSchema(GroupDTO);

        it("has property 'status'", () => {
            expect(metadata.properties["status"]).toEqual({
                key: "status",
                type: "string",
                options: {
                    enum: ["active", "inactive"]
                }
            });
        });
    });

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(GroupDTO)).toEqual(GROUP_JSON_SCHEMA);
        });

    });

});


describe("GroupGetResponse", () => {

    describe("schema generation", () => {

        it("convert to JSON schema", () => {
            expect(convertToJsonSchema(GroupGetResponse)).toEqual(GROUP_GET_RESPONSE_JSON_SCHEMA);
        });

    });

});
