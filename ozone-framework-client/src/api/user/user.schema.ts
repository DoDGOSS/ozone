import { Validator } from "../interfaces";

import { composeSchemas, createLazyValidator, JsonSchema } from "../schemas";

import { UserCreateResponse, UserDeleteResponse, UserDTO, UserGetResponse, UserUpdateResponse } from "./user.dto";


export const validateUserDTO: Validator<UserDTO> =
    createLazyValidator(() => USER_SCHEMA);


export const validateUserGetResponse: Validator<UserGetResponse> =
    createLazyValidator(() => composeSchemas(USER_GET_RESPONSE_SCHEMA, { User: USER_SCHEMA }));


export const validateUserCreateResponse: Validator<UserCreateResponse> =
    createLazyValidator(() => composeSchemas(USER_CREATE_RESPONSE_SCHEMA, { User: USER_SCHEMA }));


export const validateUserUpdateResponse: Validator<UserUpdateResponse> =
    createLazyValidator(() => composeSchemas(USER_UPDATE_RESPONSE_SCHEMA, { User: USER_SCHEMA }));


export const validateUserDeleteResponse: Validator<UserDeleteResponse> =
    createLazyValidator(() => USER_DELETE_RESPONSE_SCHEMA);


export const USER_SCHEMA_REF = "#/components/schemas/User";


export const USER_SCHEMA: JsonSchema<UserDTO> = {
    type: "object",
    required: [
        "email",
        "hasPWD",
        "id",
        "lastLogin",
        "totalDashboards",
        "totalGroups",
        "totalStacks",
        "totalWidgets",
        "username",
        "userRealName"
    ],
    additionalProperties: false,
    properties: {
        email: {
            type: "string"
        },
        hasPWD: {
            type: ["string", "null"]
        },
        id: {
            type: "number"
        },
        lastLogin: {
            type: ["string", "null"]
        },
        totalDashboards: {
            type: "number"
        },
        totalGroups: {
            type: "number"
        },
        totalStacks: {
            type: "number"
        },
        totalWidgets: {
            type: "number"
        },
        username: {
            type: "string"
        },
        userRealName: {
            type: "string"
        }
    }
};


export const USER_GET_RESPONSE_SCHEMA: JsonSchema<UserGetResponse> = {
    type: "object",
    required: [
        "success",
        "results",
        "data"
    ],
    additionalProperties: false,
    properties: {
        success: {
            type: "boolean"
        },
        results: {
            type: "number"
        },
        data: {
            type: "array",
            items: {
                $ref: USER_SCHEMA_REF
            }
        }
    }
};


export const USER_CREATE_RESPONSE_SCHEMA: JsonSchema<UserCreateResponse> = {
    type: "object",
    required: [
        "success",
        "data"
    ],
    additionalProperties: false,
    properties: {
        success: {
            type: "boolean"
        },
        data: {
            type: "array",
            items: {
                $ref: USER_SCHEMA_REF
            }
        }
    }
};


export const USER_UPDATE_RESPONSE_SCHEMA: JsonSchema<UserUpdateResponse> = {
    type: "object",
    required: [
        "success",
        "data"
    ],
    additionalProperties: false,
    properties: {
        success: {
            type: "boolean"
        },
        data: {
            type: "array",
            items: {
                $ref: USER_SCHEMA_REF
            }
        }
    }
};


export const USER_DELETE_RESPONSE_SCHEMA: JsonSchema<UserDeleteResponse> = {
    type: "object",
    required: [
        "success",
        "data"
    ],
    additionalProperties: false,
    properties: {
        success: {
            type: "boolean"
        },
        data: {
            type: "array",
            items: {
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
            }
        }
    }
};
