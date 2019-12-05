import { createValidator } from "./validate";
import { USER_GET_RESPONSE_SCHEMA, USER_SCHEMA } from "./schemas/user.schema";
import { ListOf } from "../interfaces";

export interface UserDTO {
    id: number;
    enabled: boolean;
    username: string;
    userRealName: string;
    lastLogin?: string;
    email: string;
    emailShow: boolean;
    previousLogin?: string;
    description?: string;
    lastNotification?: string;
    hasPWD?: string;
    totalDashboards: number;
    totalGroups: number;
    totalStacks: number;
    totalWidgets: number;
}

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

export interface UserCreateRequest {
    username: string;
    userRealName: string;
    email: string;
}

export interface UserUpdateRequest extends UserCreateRequest {
    id: number;
}

export const validateUserDetailResponse = createValidator<UserDTO>(USER_SCHEMA);
export const validateUserListResponse = createValidator<ListOf<UserDTO[]>>(USER_GET_RESPONSE_SCHEMA);
