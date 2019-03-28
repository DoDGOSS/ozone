export const PREFERENCE_SCHEMA = {
    title: "Preference",
    type: "object",
    required: ["id", "namespace", "path", "user", "value"],
    additionalProperties: false,
    properties: {
        id: {
            type: "number"
        },
        namespace: {
            type: "string"
        },
        path: {
            type: "string"
        },
        user: {
            type: "object",
            required: ["userId"],
            additionalProperties: false,
            properties: {
                userId: {
                    type: "string"
                }
            }
        },
        value: {
            type: "string"
        }
    }
};

export const PREFERENCE_GET_RESPONSE_SCHEMA = {
    title: "PreferenceGetResponse",
    type: "object",
    required: ["results", "rows", "success"],
    additionalProperties: false,
    properties: {
        results: {
            type: "number"
        },
        rows: {
            type: "array",
            items: {
                $ref: "#/definitions/Preference"
            }
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Preference: PREFERENCE_SCHEMA
    }
};

export const PREFERENCE_GET_SINGLE_RESPONSE_SCHEMA = {
    title: "PreferenceGetSingleResponse",
    type: "object",
    required: ["preference", "success"],
    additionalProperties: false,
    properties: {
        preference: {
            oneOf: [{ $ref: "#/definitions/Preference" }, { type: "null" }]
        },
        success: {
            type: "boolean"
        }
    },
    definitions: {
        Preference: PREFERENCE_SCHEMA
    }
};
