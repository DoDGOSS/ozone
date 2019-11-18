export const CONFIG_SCHEMA = {
    title: "Config",
    type: "object",
    required: [
        "createdDate",
        "editedDate",
        "code",
        "value",
        "title",
        "description",
        "type",
        "groupName",
        "subGroupName",
        "mutable",
        "subGroupOrder",
        "help",
        // TODO -- django add refrences not just ids.
        "createdBy",
        "editedBy"
    ],
    additionalProperties: true,
    properties: {
        code: {
            type: "string"
        },
        description: {
            type: ["string", "null"]
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
    type: "object",
    required: ["data", "results"],
    additionalProperties: true,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Config"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        Config: CONFIG_SCHEMA
    }
};
