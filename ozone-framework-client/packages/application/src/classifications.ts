export interface ClassificationConfig {
    text: string;
    backgroundColor: string;
    foregroundColor: string;

    disableTopBanner?: boolean;
    disableBottomBanner?: boolean;
}

export const DISABLED: ClassificationConfig = {
    text: "Disabled",
    backgroundColor: "#000",
    foregroundColor: "#fff",
    disableTopBanner: true,
    disableBottomBanner: true
};

export const DYNAMIC: ClassificationConfig = {
    text: "DYNAMIC PAGE - HIGHEST POSSIBLE CLASSIFICATION IS ...",
    backgroundColor: "#000",
    foregroundColor: "#fff"
};

export const UNCLASSIFIED: ClassificationConfig = {
    text: "UNCLASSIFIED",
    backgroundColor: "#090",
    foregroundColor: "#fff"
};

export const UNCLASSIFIED_FOUO: ClassificationConfig = {
    text: "UNCLASSIFIED//FOR OFFICIAL USE ONLY",
    backgroundColor: "#090",
    foregroundColor: "#fff"
};

export const CONFIDENTIAL: ClassificationConfig = {
    text: "CONFIDENTIAL",
    backgroundColor: "#00c",
    foregroundColor: "#fff"
};

export const SECRET: ClassificationConfig = {
    text: "SECRET",
    backgroundColor: "#c00",
    foregroundColor: "#fff"
};

export const TOP_SECRET: ClassificationConfig = {
    text: "TOP SECRET",
    backgroundColor: "#f60",
    foregroundColor: "#fff"
};

export const TOP_SECRET_SCI: ClassificationConfig = {
    text: "TOP SECRET//SCI",
    backgroundColor: "#fe2",
    foregroundColor: "#000"
};
