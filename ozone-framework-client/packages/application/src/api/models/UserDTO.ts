import { IdDTO } from "./IdDTO";
import { createValidator } from "./validate";
import {
    USER_CREATE_RESPONSE_SCHEMA,
    USER_DELETE_RESPONSE_SCHEMA,
    USER_GET_RESPONSE_SCHEMA,
    USER_SCHEMA,
    USER_UPDATE_RESPONSE_SCHEMA
} from "./schemas/user.schema";

export interface UserDTO {
    id: number;
    username: string;
    userRealName: string;
    email: string;
    hasPWD?: string;
    lastLogin?: string;
    totalDashboards: number;
    totalGroups: number;
    totalStacks: number;
    totalWidgets: number;
}

export const validateUser = createValidator<UserDTO>(USER_SCHEMA);

export interface UsernameDTO {
    username: string;
}

export interface UserReference {
    userId: string;
}

export interface ProfileReference {
    userId?: string;
    userRealName?: string;
}

export interface UserGetResponse {
    success: boolean;
    results: number;
    data: UserDTO[];
}

export const validateUserGetResponse = createValidator<UserGetResponse>(USER_GET_RESPONSE_SCHEMA);

export interface UserCreateRequest {
    username: string;
    userRealName: string;
    email: string;
}

export interface UserCreateResponse {
    success: boolean;
    data: UserDTO[];
}

export const validateUserCreateResponse = createValidator<UserCreateResponse>(USER_CREATE_RESPONSE_SCHEMA);

export interface UserUpdateRequest {
    id: number;
    username: string;
    userRealName: string;
    email: string;
}

export interface UserUpdateResponse {
    success: boolean;
    data: UserDTO[];
}

export const validateUserUpdateResponse = createValidator<UserUpdateResponse>(USER_UPDATE_RESPONSE_SCHEMA);

export interface UserDeleteResponse {
    success: boolean;
    data: IdDTO[];
}

export const validateUserDeleteResponse = createValidator<UserDeleteResponse>(USER_DELETE_RESPONSE_SCHEMA);
