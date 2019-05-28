import { WidgetInstance } from "../WidgetInstance";

export function getNextActiveWidget(
    activeWidget: WidgetInstance | null,
    instanceId: string,
    nextWidgets: WidgetInstance[]
): WidgetInstance | null {
    if (activeWidget !== null && activeWidget.id !== instanceId) return activeWidget;

    if (nextWidgets.length === 0) return null;

    return nextWidgets[0];
}
