export const ID_SCHEMA = {
    title: "IdObject",
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
        id: {
            type: "number"
        }
    }
};
