import { JsonSchema } from "../../schemas";

import { UserCreateResponse, UserDeleteResponse, UserDTO, UserGetResponse, UserUpdateResponse } from "../user-dto";


export const ID_SCHEMA_REFERENCE = "#/components/schemas/Id";

export const ID_JSON_SCHEMA = {
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
};


export const USER_SCHEMA_REFERENCE = "#/components/schemas/User";

export const USER_JSON_SCHEMA: JsonSchema<UserDTO> = {
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
        "userRealName",
        "username"
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
        userRealName: {
            type: "string"
        },
        username: {
            type: "string"
        }
    }
};


export const USER_GET_RESPONSE_JSON_SCHEMA: JsonSchema<UserGetResponse> = {
    type: "object",
    required: [
        "data",
        "results",
        "success"
    ],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: USER_SCHEMA_REFERENCE
            }
        },
        results: {
            type: "number"
        },
        success: {
            type: "boolean"
        }
    },
    components: {
        schemas: {
            User: USER_JSON_SCHEMA
        }
    }
};


export const USER_CREATE_RESPONSE_JSON_SCHEMA: JsonSchema<UserCreateResponse> = {
    type: "object",
    required: [
        "data",
        "success"
    ],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: USER_SCHEMA_REFERENCE
            }
        },
        success: {
            type: "boolean"
        }
    },
    components: {
        schemas: {
            User: USER_JSON_SCHEMA
        }
    }
};


export const USER_UPDATE_RESPONSE_JSON_SCHEMA: JsonSchema<UserUpdateResponse> = {
    type: "object",
    required: [
        "data",
        "success"
    ],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: USER_SCHEMA_REFERENCE
            }
        },
        success: {
            type: "boolean"
        }
    },
    components: {
        schemas: {
            User: USER_JSON_SCHEMA
        }
    }
};


export const USER_DELETE_RESPONSE_JSON_SCHEMA: JsonSchema<UserDeleteResponse> = {
    type: "object",
    required: [
        "data",
        "success"
    ],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: ID_SCHEMA_REFERENCE
            }
        },
        success: {
            type: "boolean"
        }
    },
    components: {
        schemas: {
            Id: ID_JSON_SCHEMA
        }
    }
};
