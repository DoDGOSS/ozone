export const PREFERENCE_SCHEMA = {
    title: "Preference",
    type: "object",
    required: ["id", "namespace", "path", "user", "value"],
    additionalProperties: true,
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
            additionalProperties: true,
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
    required: ["results", "data"],
    additionalProperties: true,
    properties: {
        results: {
            type: "number"
        },
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Preference"
            }
        }
    },
    definitions: {
        Preference: PREFERENCE_SCHEMA
    }
};
