export const CONFIG_SCHEMA = {
    title: "Config",
    type: "object",
    required: [
        "code",
        "description",
        "groupName",
        "help",
        "id",
        "mutable",
        "subGroupName",
        "subGroupOrder",
        "title",
        "type",
        "value"
    ],
    additionalProperties: false,
    properties: {
        code: {
            type: "string"
        },
        description: {
            type: "string"
        },
        groupName: {
            type: "string"
        },
        help: {
            type: ["string", "null"]
        },
        id: {
            type: "number"
        },
        mutable: {
            type: "boolean"
        },
        subGroupName: {
            type: ["string", "null"]
        },
        subGroupOrder: {
            type: ["number", "null"]
        },
        title: {
            type: "string"
        },
        type: {
            type: "string"
        },
        value: {
            type: ["string", "null"]
        }
    }
};

export const CONFIG_LIST_SCHEMA = {
    title: "Config",
    type: "array",
    items: {
        $ref: "#/definitions/Config"
    },
    definitions: {
        Config: CONFIG_SCHEMA
    }
};
