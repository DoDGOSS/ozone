import { BehaviorObservable } from "../../observables";

import { UserWidget } from "../UserWidget";

import { FitPanel } from "./FitPanel";
import { TabbedPanel } from "./TabbedPanel";
import { ExpandoPanel } from "./ExpandoPanel";

export type LayoutType = "fit" | "tabbed" | "accordion" | "portal" | "desktop";

export interface PanelState {
    id: string;
    title: string;
    type: LayoutType;
    widgets: UserWidget[];
}

export interface Panel<T extends PanelState> {
    readonly id: string;
    readonly type: LayoutType;
    readonly title: string;

    state(): BehaviorObservable<T>;

    closeWidget(widgetId: string): void;

    findWidgetById(widgetId: string): UserWidget | undefined;
}

export function isFitPanel(panel: Panel<any>): panel is FitPanel {
    return panel.type === "fit";
}

export function isTabbedPanel(panel: Panel<any>): panel is TabbedPanel {
    return panel.type === "tabbed";
}

export function isExpandoPanel(panel: Panel<any>): panel is ExpandoPanel {
    return panel.type === "accordion" || panel.type === "portal";
}
