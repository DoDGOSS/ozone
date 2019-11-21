import { IntentsDTO } from "./IntentDTO";
import { WidgetTypeDTO } from "./WidgetTypeDTO";

import { createValidator } from "./validate";

import { USER_WIDGET_SCHEMA } from "./schemas/user-dashboard.schema";
import { ListOf } from "../interfaces";
import { USER_WIDGETS_GET_RESPONSE_SCHEMA } from "./schemas/user.schema";

export interface UserWidgetDTO {
    id: number;
    namespace: string;
    path: string;
    value: UserWidgetPropertiesDTO;
}

export const validateUserWidgetDetailResponse = createValidator<UserWidgetDTO>(USER_WIDGET_SCHEMA);
export const validateUserWidgetListResponse = createValidator<ListOf<UserWidgetDTO[]>>(
    USER_WIDGETS_GET_RESPONSE_SCHEMA
);

export interface UserWidgetPropertiesDTO {
    background: boolean;
    definitionVisible: boolean;
    description: string | null;
    descriptorUrl: string | null;
    disabled: boolean;
    editable: boolean;
    favorite: boolean;
    groupWidget: boolean;
    headerIcon: string;
    height: number;
    image: string;
    intents: IntentsDTO;
    largeIconUrl: string;
    maximized: boolean;
    minimized: boolean;
    mobileReady: boolean;
    namespace: string;
    originalName: string;
    position: number;
    singleton: boolean;
    smallIconUrl: string;
    universalName: string;
    url: string;
    userId: string;
    userRealName: string;
    widgetGuid: string;
    visible: boolean;
    widgetTypes: WidgetTypeDTO[];
    widgetVersion: string | null;
    width: number;
    x: number;
    y: number;
}
