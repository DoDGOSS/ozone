export const AML_LISTINGTYPE_SCHEMA = {
    title: "AML Listing TYpe",
    type: "object",
    required: ["title"],
    additionalProperties: true,
    properties: {
        title: {
            type: "string"
        }
    }
};

export const AML_ICON_SCHEMA = {
    title: "AML Store Icon",
    type: "object",
    required: ["security_marking"],
    additionalProperties: true,
    properties: {
        id: {
            type: "number"
        },
        url: {
            type: "string"
        },
        security_marking: {
            type: "string"
        }
    }
};

export const AML_LISTING_SCHEMA = {
    title: "AML Store Listing",
    type: "object",
    required: ["title"],
    additionalProperties: true,
    properties: {
        id: {
            type: "number"
        },
        small_icon: {
            $ref: "#/definitions/AML_Icon"
        },
        large_icon: {
            $ref: "#/definitions/AML_Icon"
        },
        banner_icon: {
            $ref: "#/definitions/AML_Icon"
        },
        large_banner_icon: {
            $ref: "#/definitions/AML_Icon"
        },
        listing_type: {
            $ref: "#/definitions/AML_ListingType"
        },
        title: {
            type: "string"
        },
        description: {
            type: "string"
        },
        launch_url: {
            type: "string"
        },
        version_name: {
            type: "string"
        },
        unique_name: {
            type: "string"
        },
        description_short: {
            type: "string"
        },
        is_enabled: {
            type: "boolean"
        },
        is_deleted: {
            type: "boolean"
        },
        security_marking: {
            type: "string"
        },
        is_private: {
            type: "boolean"
        },
        required_listings: {
            type: "AML_Listing"
        }
    },
    definitions: {
        AML_ListingType: AML_LISTINGTYPE_SCHEMA,
        AML_Icon: AML_ICON_SCHEMA
    }
};
