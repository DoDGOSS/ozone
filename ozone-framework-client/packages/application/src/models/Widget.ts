import { Intent } from "./Intent";
import { WidgetType } from "./WidgetType";

export class WidgetProps {
    description?: string;
    descriptorUrl?: string;
    height: number;
    id?: number;
    images: {
        smallUrl: string;
        largeUrl: string;
    };
    intents: {
        send: Intent[];
        receive: Intent[];
    };
    isBackground: boolean;
    isDefinitionVisible: boolean;
    isMaximized: boolean;
    isMinimized: boolean;
    isMobileReady: boolean;
    isSingleton: boolean;
    isVisible: boolean;
    metadata?: {
        allRequired?: any[];
        directRequired?: any[];
        totalGroups?: number;
        totalUsers?: number;
    };
    title: string;
    types: WidgetType[];
    universalName: string;
    widgetGuid: string;
    url: string;
    version?: string;
    width: number;
    x: number;
    y: number;

    constructor(props: PropertiesOf<WidgetProps>) {
        Object.assign(this, props);
    }
}

export class Widget extends WidgetProps {}
