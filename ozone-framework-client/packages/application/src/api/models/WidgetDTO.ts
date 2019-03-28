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
    namespace: string;
    path: string;
    value: WidgetPropertiesDTO;
}

export const validateWidget = createValidator<WidgetDTO>(WIDGET_SCHEMA);

export interface WidgetPropertiesDTO {
    universalName?: string;
    namespace: string;
    description?: string;
    url: string;
    headerIcon: string;
    image: string;
    smallIconUrl: string;
    mediumIconUrl: string;
    width: number;
    height: number;
    x: number;
    y: number;
    minimized: boolean;
    maximized: boolean;
    widgetVersion?: string;
    totalUsers: number;
    totalGroups: number;
    singleton: boolean;
    visible: boolean;
    background: boolean;
    mobileReady: boolean;
    descriptorUrl?: string;
    definitionVisible: boolean;
    directRequired: any[];
    allRequired: any[];
    intents: IntentsDTO;
    widgetTypes: WidgetTypeDTO[];
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
    intents?: IntentsDTO;
}

export interface WidgetCreateResponse {
    success: boolean;
    data: WidgetDTO[];
}

export const validateWidgetCreateResponse = createValidator<WidgetCreateResponse>(WIDGET_CREATE_RESPONSE_SCHEMA);

export interface WidgetUpdateRequest extends WidgetCreateRequest {
    id: string;
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
    data: UserDTO[];
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
