export interface WidgetDTO {
    id: string;
    namespace: string;
    path: string;
    value: {

    };
}

export interface WidgetPropsDTO {
    universalName: string;
    namespace: string;
    description: string;
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
    widgetVersion: string;
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
    intents: {
        send: IntentDTO[];
        receive: IntentDTO[];
    };
    widgetTypes: WidgetTypeDTO[];
}

export interface IntentDTO {
    action: string;
    dataTypes: string[];
}

export interface WidgetTypeDTO {
    id: number;
    name: string;
    displayName: string;
}
