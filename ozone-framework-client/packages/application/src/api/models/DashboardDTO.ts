import { ProfileReference, UserReference } from "./UserDTO";
import { createValidator } from "./validate";
import {
    DASHBOARD_GET_RESPONSE_SCHEMA,
    DASHBOARD_SCHEMA,
    DASHBOARD_UPDATE_RESPONSE_SCHEMA
} from "./schemas/dashboard.schema";

export interface DashboardDTO {
    EDashboardLayoutList: string;
    alteredByAdmin: string;
    createdBy: ProfileReference;
    createdDate: string;
    dashboardPosition: number;
    description?: string;
    editedDate: string;
    groups: any[];
    guid: string;
    iconImageUrl?: string;
    isGroupDashboard: boolean;
    isdefault: boolean;
    layoutConfig: string;
    locked: boolean;
    markedForDeletion: boolean;
    name: string;
    prettyCreatedDate: string;
    prettyEditedDate: string;
    publishedToStore: boolean;
    stack?: any;
    type?: any;
    user: UserReference;
}

export const validateDashboard = createValidator<DashboardDTO>(DASHBOARD_SCHEMA);

export interface DashboardGetResponse {
    success: boolean;
    results: number;
    data: DashboardDTO[];
}

export const validateDashboardGetResponse = createValidator<DashboardGetResponse>(DASHBOARD_GET_RESPONSE_SCHEMA);

export interface DashboardUpdateRequest {
    name: string;
    guid: string;
    iconImageUrl?: string;
    isdefault?: boolean;
    locked?: boolean;
    description?: string;
    layoutConfig?: string;
    dashboardPosition?: number;
}

export interface DashboardUpdateParams {
    user_id?: number;
    isGroupDashboard?: boolean;
    adminEnabled?: boolean;
}

export interface DashboardUpdateResponse {
    success: boolean;
    data: DashboardDTO[];
}

export const validateDashboardUpdateResponse = createValidator<DashboardUpdateResponse>(
    DASHBOARD_UPDATE_RESPONSE_SCHEMA
);
