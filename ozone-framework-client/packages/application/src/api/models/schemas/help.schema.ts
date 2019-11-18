export const HELP_GET_RESPONSE_SCHEMA = {
    title: "Help Get Response",
    type: "array",
    items: {
        $ref: "#/definitions/HelpItem"
    },
    definitions: {
        HelpItem: {
            oneOf: [{ $ref: "#/definitions/HelpFolder" }, { $ref: "#/definitions/HelpFile" }]
        },
        HelpFolder: {
            title: "HelpFolder",
            type: "object",
            required: ["children", "leaf", "path", "text"],
            additionalProperties: true,
            properties: {
                children: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/HelpItem"
                    }
                },
                leaf: {
                    type: "boolean",
                    const: false
                },
                path: {
                    type: "string"
                },
                text: {
                    type: "string"
                }
            }
        },
        HelpFile: {
            title: "HelpFile",
            type: "object",
            required: ["leaf", "path", "text"],
            additionalProperties: true,
            properties: {
                leaf: {
                    type: "boolean",
                    const: true
                },
                path: {
                    type: "string"
                },
                text: {
                    type: "string"
                }
            }
        }
    }
};
