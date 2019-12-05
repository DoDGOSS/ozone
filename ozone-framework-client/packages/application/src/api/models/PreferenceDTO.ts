import { UserReference } from "./UserDTO";
import { createValidator } from "./validate";
import { PREFERENCE_GET_RESPONSE_SCHEMA, PREFERENCE_SCHEMA } from "./schemas/preference.schema";
import { ListOf } from "../interfaces";

export interface PreferenceDTO {
    id: number;
    namespace: string;
    path: string;
    value: string;
    user: UserReference;
}

export interface PreferenceCreateRequest {
    namespace: string;
    path: string;
    value: string;
    user?: number;
    user_id?: number;
}

export interface PreferenceUpdateRequest extends PreferenceCreateRequest {
    id?: number;
}

export interface PreferenceDeleteRequest {
    id: number;
    namespace: string;
    path: string;
    user?: number;
}

export const validatePreferenceDetailResponse = createValidator<PreferenceDTO>(PREFERENCE_SCHEMA);
export const validatePreferenceListResponse = createValidator<ListOf<PreferenceDTO[]>>(PREFERENCE_GET_RESPONSE_SCHEMA);
