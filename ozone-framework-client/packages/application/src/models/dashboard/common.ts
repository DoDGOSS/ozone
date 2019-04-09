import { UserWidget } from "../UserWidget";

export function getNextActiveWidget(
    activeWidget: UserWidget | null,
    widgetId: string,
    nextWidgets: UserWidget[]
): UserWidget | null {
    if (activeWidget === null || activeWidget.widget.id !== widgetId) return activeWidget;

    if (nextWidgets.length === 0) return null;

    return nextWidgets[0];
}
