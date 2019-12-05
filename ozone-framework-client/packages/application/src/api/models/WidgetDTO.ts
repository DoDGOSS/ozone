import { IntentsDTO } from "./IntentDTO";
import { WidgetTypeDTO, WidgetTypeReference } from "./WidgetTypeDTO";
import { createValidator } from "./validate";
import { ListOf } from "../interfaces";
import { WIDGET_GET_RESPONSE_SCHEMA, WIDGET_SCHEMA } from "./schemas/widget.schema";
import { WIDGET_GROUPS_GET_RESPONSE_SCHEMA } from "./schemas/group.schema";

export interface WidgetDTO {
    id: number;
    namespace: string;
    path: string;
    value: WidgetPropertiesDTO;
}

export interface WidgetPropertiesDTO {
    id?: any;
    allRequired: string[];
    directRequired: string[];
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
    universalName: string;
    widgetGuid: string;
    url: string;
    visible: boolean;
    widgetTypes: WidgetTypeDTO[];
    widgetVersion: string | null;
    width: number;
    x: number;
    y: number;
}

export interface GetWidgetGroupsResponse {
    // TODO: look into strongly typing these properties
    widget: object;
    groups: [];
}

export const validateWidgetDetailResponse = createValidator<WidgetDTO>(WIDGET_SCHEMA);
export const validateWidgetListResponse = createValidator<ListOf<WidgetDTO[]>>(WIDGET_GET_RESPONSE_SCHEMA);
export const validateWidgetGroupsResponse = createValidator<GetWidgetGroupsResponse>(WIDGET_GROUPS_GET_RESPONSE_SCHEMA);

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

export interface WidgetGetDescriptorResponse {
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
    widgetTypes: string[];
    descriptorUrl?: string;
    intents: IntentsDTO;
}

export interface WidgetUpdateRequest extends WidgetCreateRequest {
    id: number;
    widget_ids?: number[];
}
