import { createValidator } from "./validate";
import { AML_ICON_SCHEMA, AML_LISTING_SCHEMA, AML_LISTINGTYPE_SCHEMA } from "./schemas/store.schema";

export interface AMLListingTypeDTO {
    title: string;
}

export const validateAMLListingType = createValidator<AMLListingTypeDTO>(AML_LISTINGTYPE_SCHEMA);

export interface AMLIconDTO {
    id: number;
    url: string;
    security_marking: string;
}

export const validateAMLIcon = createValidator<AMLIconDTO>(AML_ICON_SCHEMA);

export interface AMLListingDTO {
    id: number;
    small_icon: AMLIconDTO;
    large_icon: AMLIconDTO;
    banner_icon: AMLIconDTO;
    large_banner_icon: AMLIconDTO;
    listing_type: AMLListingTypeDTO;
    title: string;
    description: string;
    launch_url: string;
    version_name: string;
    unique_name: string;
    description_short: string;
    is_enabled: boolean;
    is_deleted: boolean;
    security_marking: string;
    is_private: boolean;
    required_listings: AMLListingDTO[];
}

export const validateAMLListing = createValidator<AMLListingDTO>(AML_LISTING_SCHEMA);
