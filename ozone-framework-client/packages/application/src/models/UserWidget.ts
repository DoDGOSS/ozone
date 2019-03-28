import { PropertiesOf } from "../types";

import { Widget } from "./Widget";

export class UserWidgetProps {
    id: number;
    isDisabled: boolean;
    isEditable: boolean;
    isFavorite: boolean;
    isGroupWidget: boolean;
    originalTitle: string;
    position: number;
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
