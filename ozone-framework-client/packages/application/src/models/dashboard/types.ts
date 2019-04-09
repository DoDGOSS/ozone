import { BehaviorObservable } from "../../observables";

import { UserWidget } from "../UserWidget";

import { FitPanel } from "./FitPanel";
import { TabbedPanel, TabbedPanelState } from "./TabbedPanel";
import { ExpandoPanel, ExpandoPanelState } from "./ExpandoPanel";

export type LayoutType = "fit" | "tabbed" | "accordion" | "portal";

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

export function isTabbedPanelState(state: PanelState): state is TabbedPanelState {
    return state.type === "tabbed";
}

export function isExpandoPanel(panel: Panel<any>): panel is ExpandoPanel {
    return panel.type === "accordion" || panel.type === "portal";
}

export function isExpandoPanelState(state: PanelState): state is ExpandoPanelState {
    return state.type === "accordion" || state.type === "portal";
}
