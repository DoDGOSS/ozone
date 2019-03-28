import { UserWidget } from "../models/UserWidget";
import { Widget } from "../models/Widget";

export interface UserWidgetParams {
    id: number;
    position: number;
    widget: Widget;
}

export function createUserWidget(params: UserWidgetParams): UserWidget {
    return new UserWidget({
        id: params.id,
        isDisabled: false,
        isEditable: true,
        isFavorite: false,
        isGroupWidget: false,
        originalTitle: params.widget.title,
        position: params.position,
        user: {
            username: "testAdmin1",
            displayName: "Test Admin 1"
        },
        widget: params.widget
    });
}
