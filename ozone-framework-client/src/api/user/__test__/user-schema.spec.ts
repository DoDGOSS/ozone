import "reflect-metadata";

import { UserCreateResponse, UserDeleteResponse, UserDTO, UserGetResponse, UserUpdateResponse } from "../user-dto";

import { getDefaultComponentContainer } from "../../../lib/openapi/container";
import { convertToJsonSchema } from "../../../lib/openapi/convert-json";

import {
    USER_CREATE_RESPONSE_JSON_SCHEMA,
    USER_DELETE_RESPONSE_JSON_SCHEMA,
    USER_GET_RESPONSE_JSON_SCHEMA,
    USER_JSON_SCHEMA,
    USER_UPDATE_RESPONSE_JSON_SCHEMA
} from "./schemas";


describe("UserDTO metadata", () => {

    const metadata = getDefaultComponentContainer().getSchema(UserDTO);

    it("has property 'id'", () => {
        expect(metadata.properties["id"]).toEqual({
            key: "id",
            type: "number"
        });
    });

    it("has property 'email", () => {
        expect(metadata.properties["email"]).toEqual({
            key: "email",
            type: "string"
        });
    });

    it("has property 'hasPWD'", () => {
        expect(metadata.properties["hasPWD"]).toEqual({
            key: "hasPWD",
            type: "string",
            options: {
                nullable: true
            }
        });
    });

    it("has property 'lastLogin'", () => {
        expect(metadata.properties["lastLogin"]).toEqual({
            key: "lastLogin",
            type: "string",
            options: {
                nullable: true,
                readOnly: true
            }
        });
    });

});


describe("UserGetResponse metadata", () => {

    const metadata = getDefaultComponentContainer().getResponse(UserGetResponse);

    it("has property 'success'", () => {
        expect(metadata.properties["success"]).toEqual({
            key: "success",
            type: "boolean"
        });
    });

    it("has property 'results'", () => {
        expect(metadata.properties["results"]).toEqual({
            key: "results",
            type: "number"
        });
    });

    it("has property 'data'", () => {
        const property = metadata.properties["data"];

        expect(property).toEqual({
            key: "data",
            type: "array",
            typeProvider: expect.any(Function)
        });

        expect(property.typeProvider!()).toEqual(UserDTO);
    });

});


describe("UserDTO schema generation", () => {

    it("convert to JSON schema", () => {
        expect(convertToJsonSchema(UserDTO)).toEqual(USER_JSON_SCHEMA);
    });

});


describe("UserGetResponse schema generation", () => {

    it("convert to JSON schema", () => {
        expect(convertToJsonSchema(UserGetResponse)).toEqual(USER_GET_RESPONSE_JSON_SCHEMA);
    });

});


describe("UserCreateResponse schema generation", () => {

    it("convert to JSON schema", () => {
        expect(convertToJsonSchema(UserCreateResponse)).toEqual(USER_CREATE_RESPONSE_JSON_SCHEMA);
    });

});


describe("UserUpdateResponse schema generation", () => {

    it("convert to JSON schema", () => {
        expect(convertToJsonSchema(UserUpdateResponse)).toEqual(USER_UPDATE_RESPONSE_JSON_SCHEMA);
    });

});


describe("UserDeleteResponse schema generation", () => {

    it("convert to JSON schema", () => {
        expect(convertToJsonSchema(UserDeleteResponse)).toEqual(USER_DELETE_RESPONSE_JSON_SCHEMA);
    });

});
