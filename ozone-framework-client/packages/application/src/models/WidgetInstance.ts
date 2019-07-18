import { UserWidget } from "./UserWidget";

import { uuid } from "../utility";
import { Widget } from "./Widget";

export interface WidgetInstance {
    readonly id: string;
    readonly userWidget: UserWidget;
}

export const WidgetInstance = {
    create(userWidget: UserWidget, id?: string): WidgetInstance {
        return Object.freeze({
            id: id || uuid(),
            userWidget
        });
    }
};

export function getWidgetOf(instance: WidgetInstance): Widget {
    return instance.userWidget.widget;
}

export function getInstanceWidgetsOf(instances: WidgetInstance[]): Widget[] {
    return instances.map(getWidgetOf);
}
