import { UserWidget } from "./UserWidget";

import { uuid } from "../utility";

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
