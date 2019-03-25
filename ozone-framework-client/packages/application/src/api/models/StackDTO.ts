import { GroupDTO } from "./GroupDTO";
import { UserDTO, UsernameDTO } from "./UserDTO";
import { createValidator } from "./validate";
import {
    STACK_CREATE_RESPONSE_SCHEMA,
    STACK_DELETE_RESPONSE_SCHEMA,
    STACK_GET_RESPONSE_SCHEMA,
    STACK_SCHEMA,
    STACK_UPDATE_RESPONSE_SCHEMA
} from "./schemas/stack.schema";

export interface StackDTO {
    approved: boolean;
    imageUrl?: string;
    id: number;
    owner?: UsernameDTO;
    groups: any[];
    stackContext: string;
    defaultGroup: GroupDTO;
    descriptorUrl?: string;
    description?: string;
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
    id: number;
    update_action?: "add" | "remove";
    tab?: "users" | "groups";
    data?: UserDTO[] | GroupDTO[];
}

export type StackUpdateResponse = StackCreateResponse;

export const validateStackUpdateResponse = createValidator<StackUpdateResponse>(STACK_UPDATE_RESPONSE_SCHEMA);

export interface StackDeleteIdDTO {
    id: number;
}

export interface StackDeleteResponse {
    success: boolean;
    data: StackDeleteIdDTO[];
}

export const validateStackDeleteResponse = createValidator<StackDeleteResponse>(STACK_DELETE_RESPONSE_SCHEMA);
