import { GroupDTO } from "./GroupDTO";
import { IntentsDTO } from "./IntentDTO";
import { UserDTO } from "./UserDTO";
import { WidgetTypeDTO, WidgetTypeReference } from "./WidgetTypeDTO";
import { createValidator } from "./validate";
import {
    WIDGET_CREATE_RESPONSE_SCHEMA,
    WIDGET_DELETE_RESPONSE_SCHEMA,
    WIDGET_GET_RESPONSE_SCHEMA,
    WIDGET_SCHEMA,
    WIDGET_UPDATE_GROUPS_RESPONSE_SCHEMA,
    WIDGET_UPDATE_USERS_RESPONSE_SCHEMA
} from "./schemas/widget.schema";

export interface WidgetDTO {
    id: string;
    displayName: string;
    widgetVersion: string;
    description: string;
    widgetUrl: string;
    widgetTypes: WidgetTypeReference[];
    namespace: string;
    path: string;
    value: WidgetPropertiesDTO;
    totalDashboards: number;
    totalGroups: number;
    totalStacks: number;
    totalWidgets: number;
}

export const validateWidget = createValidator<WidgetDTO>(WIDGET_SCHEMA);

export interface WidgetPropertiesDTO {
    allRequired: any[];
    directRequired: any[];
    background: boolean;
    definitionVisible: boolean;
    description: string | null;
    descriptorUrl: string | null;
    headerIcon: string;
    height: number;
    image: string;
    intents: IntentsDTO;
    maximized: boolean;
    mediumIconUrl: string;
    minimized: boolean;
    mobileReady: boolean;
    namespace: string;
    singleton: boolean;
    smallIconUrl: string;
    totalGroups: number;
    totalUsers: number;
    universalName: string | null;
    url: string;
    visible: boolean;
    widgetTypes: WidgetTypeDTO[];
    widgetVersion: string | null;
    width: number;
    x: number;
    y: number;
}

export interface WidgetGetResponse {
    success: boolean;
    results: number;
    data: WidgetDTO[];
}

export const validateWidgetGetResponse = createValidator<WidgetGetResponse>(WIDGET_GET_RESPONSE_SCHEMA);

export interface WidgetCreateRequest {
    displayName: string;
    widgetVersion: string;
    description: string;
    widgetUrl: string;
    imageUrlSmall: string;
    imageUrlMedium: string;
    width: number;
    height: number;
    widgetGuid: string;
    universalName: string;
    visible: boolean;
    background: boolean;
    singleton: boolean;
    mobileReady: boolean;
    widgetTypes: WidgetTypeReference[];
    descriptorUrl?: string;
    intents: IntentsDTO;
}

export interface WidgetCreateResponse {
    success: boolean;
    data: WidgetDTO[];
}

export const validateWidgetCreateResponse = createValidator<WidgetCreateResponse>(WIDGET_CREATE_RESPONSE_SCHEMA);

export interface WidgetUpdateRequest extends WidgetCreateRequest {
    id: number;
    update_action?: "add" | "remove";
    widget_ids?: number[];
}

export interface WidgetDeleteIdDTO {
    id: string;
    value: object;
}

export interface WidgetDeleteResponse {
    success: boolean;
    data: WidgetDeleteIdDTO[];
}

export const validateWidgetDeleteResponse = createValidator<WidgetDeleteResponse>(WIDGET_DELETE_RESPONSE_SCHEMA);

export interface WidgetUpdateUsersResponse {
    success: boolean;
    data: WidgetDTO[];
}

export const validateWidgetUpdateUsersResponse = createValidator<WidgetUpdateUsersResponse>(
    WIDGET_UPDATE_USERS_RESPONSE_SCHEMA
);

export interface WidgetUpdateGroupsResponse {
    success: boolean;
    data: GroupDTO[];
}

export const validateWidgetUpdateGroupsResponse = createValidator<WidgetUpdateGroupsResponse>(
    WIDGET_UPDATE_GROUPS_RESPONSE_SCHEMA
);
