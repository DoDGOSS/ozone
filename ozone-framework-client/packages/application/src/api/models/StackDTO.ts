import { GroupDTO } from "./GroupDTO";
import { UserDTO, UsernameDTO } from "./UserDTO";
import { createValidator } from "./validate";
import {
    STACK_CREATE_RESPONSE_SCHEMA,
    STACK_DELETE_ADMIN_RESPONSE_SCHEMA,
    STACK_DELETE_USER_RESPONSE_SCHEMA,
    STACK_GET_RESPONSE_SCHEMA,
    STACK_SCHEMA,
    STACK_UPDATE_RESPONSE_SCHEMA
} from "./schemas/stack.schema";
import { DashboardDTO } from "./DashboardDTO";
import { WidgetDTO } from "./WidgetDTO";

export interface StackDTO {
    approved: boolean;
    defaultGroup: GroupDTO;
    description?: string;
    descriptorUrl?: string;
    groups: GroupDTO[];
    id: number;
    imageUrl?: string;
    owner?: UsernameDTO;
    stackContext: string;
    name: string;
    totalWidgets: number;
    totalGroups: number;
    totalUsers: number;
    totalDashboards: number;
}

export const validateStack = createValidator<StackDTO>(STACK_SCHEMA);

export interface StackGetResponse {
    results: number;
    data: StackDTO[];
}

export const validateStackGetResponse = createValidator<StackGetResponse>(STACK_GET_RESPONSE_SCHEMA);

export interface StackUpdateParams {
    adminEnabled?: boolean;
}

export interface StackCreateRequest {
    name: string;
    approved?: boolean;
    imageUrl?: string;
    stackContext: string;
    descriptorUrl?: string;
    description?: string;
}

export interface StackCreateResponse {
    success: boolean;
    data: StackDTO[];
}

export const validateStackCreateResponse = createValidator<StackUpdateResponse>(STACK_CREATE_RESPONSE_SCHEMA);

export interface StackUpdateRequest extends StackCreateRequest {
    name: string;
    id: number;
    update_action?: "add" | "remove";
    tab?: "users" | "groups";
    data?: UserDTO[] | GroupDTO[];
    imageUrl?: string;
}

export type StackUpdateResponse = StackCreateResponse;

export const validateStackUpdateResponse = createValidator<StackUpdateResponse>(STACK_UPDATE_RESPONSE_SCHEMA);

export interface StackShareResponse {
    name: string;
    stackContext: string;
    description: string | null;
    imageUrl: string | null;
    dashboards?: DashboardDTO[];
    widgets?: WidgetDTO[];
}

export interface StackDeleteAdminView {
    id: number;
}

export interface StackDeleteAdminResponse {
    success: boolean;
    data: StackDeleteAdminView[];
}

export const validateStackDeleteAdminResponse = createValidator<StackDeleteAdminResponse>(
    STACK_DELETE_ADMIN_RESPONSE_SCHEMA
);

export interface StackDeleteUserView {
    approved: boolean;
    defaultGroup?: {
        id: number;
    };
    description?: null;
    descriptorUrl?: string;
    groups: any[];
    id: number;
    imageUrl?: string;
    name: string;
    owner?: {
        id: number;
    };
    stackContext: string;
    uniqueWidgetCount: number;
}

export interface StackDeleteUserResponse {
    data: StackDeleteUserView[];
    success: boolean;
}

export const validateStackDeleteUserResponse = createValidator<StackDeleteUserResponse>(
    STACK_DELETE_USER_RESPONSE_SCHEMA
);
