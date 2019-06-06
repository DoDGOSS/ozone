import { BehaviorObservable } from "../../observables";

import { FitPanel } from "./FitPanel";
import { TabbedPanel, TabbedPanelState } from "./TabbedPanel";
import { ExpandoPanel, ExpandoPanelState } from "./ExpandoPanel";
import { WidgetInstance } from "../WidgetInstance";

export type LayoutType = "fit" | "tabbed" | "accordion" | "portal";

export interface PanelState {
    id: string;
    title: string;
    type: LayoutType;
    widgets: WidgetInstance[];
}

export interface AddWidgetsOpts {
    onSuccess?: () => void;
    onFailure?: () => void;
}

export interface Panel<T extends PanelState = PanelState> {
    readonly id: string;
    readonly type: LayoutType;
    readonly title: string;
    readonly widgetCount: number;

    state(): BehaviorObservable<T>;

    addWidgets(instance: WidgetInstance | WidgetInstance[], opts?: AddWidgetsOpts): void;

    closeWidget(instanceId: string): WidgetInstance | undefined;

    findWidget(instanceId: string): WidgetInstance | undefined;

    setTitle(value: string): void;
}

export function isFitPanel(panel: Panel): panel is FitPanel {
    return panel.type === "fit";
}

export function isTabbedPanel(panel: Panel): panel is TabbedPanel {
    return panel.type === "tabbed";
}

export function isTabbedPanelState(state: PanelState): state is TabbedPanelState {
    return state.type === "tabbed";
}

export function isExpandoPanel(panel: Panel): panel is ExpandoPanel {
    return panel.type === "accordion" || panel.type === "portal";
}

export function isExpandoPanelState(state: PanelState): state is ExpandoPanelState {
    return state.type === "accordion" || state.type === "portal";
}
