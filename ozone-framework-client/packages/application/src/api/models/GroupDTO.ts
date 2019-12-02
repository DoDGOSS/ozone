import { createValidator } from "./validate";
import { GROUP_GET_RESPONSE_SCHEMA, GROUP_SCHEMA, GROUP_WIDGETS_GET_RESPONSE_SCHEMA } from "./schemas/group.schema";
import { ListOf } from "../interfaces";

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

export interface GroupCreateRequest {
    name: string;
    displayName?: string;
    description?: string;
    email?: string;
    automatic?: boolean;
    status?: "active" | "inactive";
    active?: boolean;
}

export interface GroupUpdateRequest extends GroupCreateRequest {
    id: number;
    user_ids?: number[];
}

export interface GetGroupWidgetsResponse {
    group: object;
    widgets: [];
}

export function isDefaultGroup(group: GroupDTO | undefined): boolean {
    return group !== undefined && group !== null && (group.name === "OWF Administrators" || group.name === "OWF Users");
}

export function isAutoManaged(group: GroupDTO | undefined): boolean {
    return group !== undefined && group !== null && group.automatic;
}

export const validateGroupDetailResponse = createValidator<GroupDTO>(GROUP_SCHEMA);
export const validateGroupListResponse = createValidator<ListOf<GroupDTO[]>>(GROUP_GET_RESPONSE_SCHEMA);
export const validateGroupWidgetsResponse = createValidator<GetGroupWidgetsResponse>(GROUP_WIDGETS_GET_RESPONSE_SCHEMA);
