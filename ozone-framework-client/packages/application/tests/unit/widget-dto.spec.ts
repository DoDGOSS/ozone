import "reflect-metadata";

import * as fs from "fs";
import * as path from "path";

import { convertToJsonSchema } from "@ozone/openapi-decorators";

import { WidgetDTO } from "../../src/api/models/WidgetDTO";

import { expectSuccessfulValidation } from "./assertions";
import { WIDGETS } from "./data";

describe("WidgetDTO", () => {
    describe("validate", () => {
        test("is valid", () => {
            expectSuccessfulValidation(() => WidgetDTO.validate(WIDGETS[0]));
        });
    });

    describe("schema generation", () => {
        it("convert to JSON schema", () => {
            const schema = readSchema("widget-dto-schema.json");
            expect(convertToJsonSchema(WidgetDTO)).toEqual(schema);
        });
    });
});

function readSchema(filename: string): string {
    const json = fs.readFileSync(path.resolve(__dirname, filename), { encoding: "utf8" });
    return JSON.parse(json);
}
