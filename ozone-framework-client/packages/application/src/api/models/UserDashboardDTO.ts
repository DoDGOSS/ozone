import { UsernameDTO } from "./UserDTO";
import { UserWidgetDTO } from "./UserWidgetDTO";
import { AuthUserDTO } from "../../api/models/AuthUserDTO";

import { createValidator } from "./validate";

import {
    USER_DASHBOARD_SCHEMA,
    USER_DASHBOARD_STACK_SCHEMA,
    USER_DASHBOARD_USER_SCHEMA,
    USER_DASHBOARDS_GET_RESPONSE_SCHEMA
} from "./schemas/user-dashboard.schema";

export interface UserDashboardDTO {
    id: number;
    alteredByAdmin: boolean;
    dashboardPosition: number;
    description: string | null;
    guid: string;
    iconImageUrl: string | null;
    isGroupDashboard: boolean;
    isdefault: boolean;
    layoutConfig: string;
    locked: boolean;
    markedForDeletion: boolean;
    name: string;
    publishedToStore: boolean;
    stack: UserDashboardStackDTO;
    type: null;
    user: UserDashboardUserDTO;
}

export const validateUserDashboard = createValidator<UserDashboardDTO>(USER_DASHBOARD_SCHEMA);

export interface UserDashboardsGetResponse {
    user: AuthUserDTO;
    dashboards: UserDashboardDTO[];
    widgets: UserWidgetDTO[];
}

export const validateUserDashboardsGetResponse = createValidator<UserDashboardsGetResponse>(
    USER_DASHBOARDS_GET_RESPONSE_SCHEMA
);

export interface UserDashboardStackDTO {
    approved: boolean;
    description: string | null;
    descriptorUrl: string | null;
    id: number;
    imageUrl: string | null;
    name: string;
    owner: UsernameDTO | null;
    stackContext: string;
    totalWidgets: number;
}

export const validateUserDashboardStack = createValidator<UserDashboardStackDTO>(USER_DASHBOARD_STACK_SCHEMA);

export interface UserDashboardUserDTO {
    email: string;
    id: number;
    lastLogin: string | null;
    username: string;
    userRealName: string;
}

export const validateUserDashboardUser = createValidator<UserDashboardUserDTO>(USER_DASHBOARD_USER_SCHEMA);
