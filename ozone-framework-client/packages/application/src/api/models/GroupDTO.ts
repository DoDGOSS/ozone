import { IdDTO } from "./IdDTO";
import { createValidator } from "./validate";
import {
    GROUP_CREATE_RESPONSE_SCHEMA,
    GROUP_DELETE_RESPONSE_SCHEMA,
    GROUP_GET_RESPONSE_SCHEMA,
    GROUP_SCHEMA,
    GROUP_UPDATE_RESPONSE_SCHEMA
} from "./schemas/group.schema";

export interface GroupDTO {
    id: number;
    name: string;
    displayName: string | null;
    description: string | null;
    email: string | null;
    status: "active" | "inactive";
    automatic: boolean;
    stackDefault: boolean;
    totalStacks: number;
    totalUsers: number;
    totalWidgets: number;
}

export const validateGroup = createValidator<GroupDTO>(GROUP_SCHEMA);

export interface GroupGetResponse {
    results: number;
    data: GroupDTO[];
}

export const validateGroupGetResponse = createValidator<GroupGetResponse>(GROUP_GET_RESPONSE_SCHEMA);

export interface GroupCreateRequest {
    name: string;
    displayName?: string;
    description?: string;
    email?: string;
    automatic?: boolean;
    status?: "active" | "inactive";
    active?: boolean;
}

export interface GroupCreateResponse {
    success: boolean;
    data: GroupDTO[];
}

export const validateGroupCreateResponse = createValidator<GroupCreateResponse>(GROUP_CREATE_RESPONSE_SCHEMA);

export interface GroupUpdateRequest extends GroupCreateRequest {
    id: number;
    update_action?: "add" | "remove";
    user_ids?: number[];
}

export interface GroupUpdateResponse {
    success: boolean;
    data: GroupDTO[];
}

export const validateGroupUpdateResponse = createValidator<GroupUpdateResponse>(GROUP_UPDATE_RESPONSE_SCHEMA);

export interface GroupDeleteResponse {
    success: boolean;
    data: IdDTO[];
}

export const validateGroupDeleteResponse = createValidator<GroupDeleteResponse>(GROUP_DELETE_RESPONSE_SCHEMA);

export function isDefaultGroup(group: GroupDTO): boolean {
    return group !== undefined && group !== null && (group.name === 'OWF Administrators' || group.name === 'OWF Users');
}
