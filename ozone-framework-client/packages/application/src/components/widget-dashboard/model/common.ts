import { ObservableWidget } from "./ObservableWidget";

export function getNextActiveWidget(
    activeWidget: ObservableWidget | null,
    widgetId: string,
    nextWidgets: ObservableWidget[]
): ObservableWidget | null {
    if (activeWidget === null || activeWidget.id !== widgetId) return activeWidget;

    if (nextWidgets.length === 0) return null;

    return nextWidgets[0];
}
