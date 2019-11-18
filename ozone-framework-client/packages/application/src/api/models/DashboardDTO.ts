import { ProfileReference, UserReference } from "./UserDTO";
import { createValidator } from "./validate";
import { DASHBOARD_GET_RESPONSE_SCHEMA, DASHBOARD_SCHEMA } from "./schemas/dashboard.schema";
import { StackDTO } from "./StackDTO";
import { ListOf } from "../interfaces";

export interface DashboardDTO {
    id: number;
    alteredByAdmin: string;
    createdDate: string;
    dashboardPosition: number;
    description?: string;
    editedDate: string;
    guid: string;
    iconImageUrl?: string;
    isGroupDashboard: boolean;
    isdefault: boolean;
    layoutConfig: string;
    locked: boolean;
    markedForDeletion: boolean;
    name: string;
    publishedToStore: boolean;
    type?: any;
    // TODO: DJANGO NEEDED.
    createdBy: ProfileReference;
    stack?: StackDTO;
    user: UserReference;
    data?: any;
}

export interface DashboardUpdateRequest extends DashboardCreateRequest {
    id: number;
}

export interface DashboardCreateRequest {
    dashboardPosition?: number;
    description?: string;
    guid: string;
    iconImageUrl?: string;
    isdefault?: boolean;
    layoutConfig?: string;
    locked?: boolean;
    stack?: StackDTO;
    name: string;
}

export const validateDashboardListResponse = createValidator<ListOf<DashboardDTO[]>>(DASHBOARD_GET_RESPONSE_SCHEMA);
export const validateDashboardDetailResponse = createValidator<DashboardDTO>(DASHBOARD_SCHEMA);
