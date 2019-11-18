export const ID_SCHEMA = {
    title: "IdObject",
    type: "object",
    required: ["id"],
    additionalProperties: true,
    properties: {
        id: {
            type: "number"
        }
    }
};
