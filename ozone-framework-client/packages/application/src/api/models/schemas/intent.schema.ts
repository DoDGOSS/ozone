export const INTENT_SCHEMA = {
    title: "Intent",
    type: "object",
    required: ["action", "dataTypes"],
    additionalProperties: false,
    properties: {
        action: {
            type: "string"
        },
        dataTypes: {
            type: "array",
            items: {
                type: "string"
            }
        }
    }
};

export const INTENTS_SCHEMA = {
    title: "Intents",
    type: "object",
    required: ["receive", "send"],
    additionalProperties: false,
    properties: {
        receive: {
            type: "array",
            items: {
                $ref: "#/definitions/Intent"
            }
        },
        send: {
            type: "array",
            items: {
                $ref: "#/definitions/Intent"
            }
        }
    },
    definitions: {
        Intent: INTENT_SCHEMA
    }
};
