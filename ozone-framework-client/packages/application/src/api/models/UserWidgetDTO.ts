import { IntentsDTO } from "./IntentDTO";
import { WidgetTypeDTO } from "./WidgetTypeDTO";

import { createValidator } from "./validate";

import { USER_WIDGET_SCHEMA } from "./schemas/user-dashboard.schema";

export interface UserWidgetDTO {
    id: number;
    namespace: string;
    path: string;
    value: UserWidgetPropertiesDTO;
}

export const validateUserWidget = createValidator<UserWidgetDTO>(USER_WIDGET_SCHEMA);

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
    universalName: string | null;
    url: string;
    userId: string;
    userRealName: string;
    visible: boolean;
    widgetTypes: WidgetTypeDTO[];
    widgetVersion: string | null;
    width: number;
    x: number;
    y: number;
}
