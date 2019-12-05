export const DASHBOARD_SCHEMA = {
    title: "Dashboard",
    type: "object",
    required: [
        "isdefault",
        "dashboardPosition",
        "alteredByAdmin",
        "guid",
        "name",
        "description",
        "createdDate",
        "editedDate",
        "layoutConfig",
        "locked",
        "type",
        "iconImageUrl",
        "publishedToStore",
        "markedForDeletion",
        "user",
        "createdBy",
        "editedBy",
        "stack",
        "isGroupDashboard",
        "disabled",
        "originalName"
    ],
    additionalProperties: true,
    properties: {
        id: {
            type: "number"
        },
        alteredByAdmin: {
            type: "boolean"
        },
        createdBy: {
            oneOf: [
                { type: "null" },
                {
                    type: "object",
                    required: ["id", "userRealName"],
                    additionalProperties: true,
                    properties: {
                        id: {
                            type: ["number", "null"]
                        },
                        userRealName: {
                            type: ["string", "null"]
                        }
                    }
                }
            ]
        },
        editedBy: {
            oneOf: [
                { type: "null" },
                {
                    type: "object",
                    required: ["id", "userRealName"],
                    additionalProperties: true,
                    properties: {
                        id: {
                            type: ["number", "null"]
                        },
                        userRealName: {
                            type: ["string", "null"]
                        }
                    }
                }
            ]
        },
        createdDate: {
            type: "string"
        },
        dashboardPosition: {
            type: "number"
        },
        description: {
            type: ["string", "null"]
        },
        editedDate: {
            type: ["string", "null"]
        },
        guid: {
            type: "string"
        },
        iconImageUrl: {
            type: ["string", "null"]
        },
        isGroupDashboard: {
            type: "boolean"
        },
        isdefault: {
            type: "boolean"
        },
        layoutConfig: {
            type: "string"
        },
        locked: {
            type: "boolean"
        },
        markedForDeletion: {
            type: "boolean"
        },
        name: {
            type: "string"
        },
        publishedToStore: {
            type: "boolean"
        },
        stack: {
            oneOf: [{ type: "null" }, { type: "object" }]
        },
        type: {
            type: ["null", "string"] // TODO
        },
        user: {
            type: "object",
            required: ["id"],
            additionalProperties: true,
            properties: {
                id: {
                    type: "number"
                }
            }
        }
    }
};

export const DASHBOARD_GET_RESPONSE_SCHEMA = {
    title: "DashboardGetResponse",
    type: "object",
    required: ["data", "results"],
    additionalProperties: true,
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/definitions/Dashboard"
            }
        },
        results: {
            type: "number"
        }
    },
    definitions: {
        Dashboard: DASHBOARD_SCHEMA
    }
};
