import { UserReference } from "./UserDTO";
import { createValidator } from "./validate";
import {
    PREFERENCE_GET_RESPONSE_SCHEMA,
    PREFERENCE_GET_SINGLE_RESPONSE_SCHEMA,
    PREFERENCE_SCHEMA
} from "./schemas/preference.schema";

export interface PreferenceDTO {
    id: number;
    namespace: string;
    path: string;
    value: string;
    user: UserReference;
}

export const validatePreference = createValidator<PreferenceDTO>(PREFERENCE_SCHEMA);

export interface PreferenceGetResponse {
    success: boolean;
    results: number;
    rows: PreferenceDTO[];
}

export const validatePreferenceGetResponse = createValidator<PreferenceGetResponse>(PREFERENCE_GET_RESPONSE_SCHEMA);

export interface PreferenceGetSingleResponse {
    success: boolean;
    preference?: PreferenceDTO;
}

export const validatePreferenceGetSingleResponse = createValidator<PreferenceGetSingleResponse>(
    PREFERENCE_GET_SINGLE_RESPONSE_SCHEMA
);

export interface PreferenceCreateRequest {
    namespace: string;
    path: string;
    value: string;
    userId?: number;
}

export interface PreferenceUpdateRequest extends PreferenceCreateRequest {
    id?: number;
}

export interface PreferenceDeleteRequest {
    id: number;
    namespace: string;
    path: string;
    userId?: number;
}
