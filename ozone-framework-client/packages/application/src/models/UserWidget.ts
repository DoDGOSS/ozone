import { Widget } from "./Widget";

export class UserWidgetProps {
    id: number;
    isDisabled: boolean;
    isEditable: boolean;
    isFavorite: boolean;
    isGroupWidget: boolean;

    /** Transient value used to pass launch data to a Widget using the Widget Launcher API */
    launchData?: string;

    position: number;
    title: string;
    user: {
        username: string;
        displayName: string;
    };
    widget: Widget;

    constructor(props: PropertiesOf<UserWidgetProps>) {
        Object.assign(this, props);
    }
}

export class UserWidget extends UserWidgetProps {}
