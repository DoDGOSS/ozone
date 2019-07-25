import { findIndex, isArray } from "lodash";

import { AddWidgetsOpts, PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";
import { WidgetInstance } from "../WidgetInstance";

import { getNextActiveWidget } from "./common";
import { omitIndex, swapIndices, uuid } from "../../utility";

export interface TabbedPanelState extends PanelState {
    activeWidget: WidgetInstance | null;
}

export interface TabbedPanelOpts {
    id?: string;
    title?: string;
    widgets?: WidgetInstance[];
    activeWidget?: WidgetInstance | null;
}

export class TabbedPanel extends AbstractPanel<TabbedPanelState> {
    constructor(opts: TabbedPanelOpts = {}) {
        super({
            id: opts.id || uuid(),
            title: opts.title || "",
            type: "tabbed" as const,
            widgets: opts.widgets || [],
            activeWidget: opts.activeWidget == null && opts.widgets && opts.widgets.length > 0 ? opts.widgets[0] : null
        });
    }

    addWidgets(instance: WidgetInstance | WidgetInstance[], opts?: AddWidgetsOpts): void {
        const prev = this.state$.value;
        const { activeWidget, widgets } = prev;

        const instances = !isArray(instance) ? [instance] : instance;
        const nextWidgets = [...widgets, ...instances];
        const nextActive = nextWidgets.length > 0 ? nextWidgets[0] : null;

        this.state$.next({
            ...prev,
            widgets: nextWidgets,
            activeWidget: activeWidget ? activeWidget : nextActive
        });

        if (opts && opts.onSuccess) opts.onSuccess();
    }

    closeWidget(instanceId: string): WidgetInstance | undefined {
        const prev = this.state$.value;
        const { activeWidget, widgets } = prev;

        const widgetIdx = findIndex(widgets, (w) => w.id === instanceId);
        const instance = widgets[widgetIdx];

        const nextWidgets = omitIndex(widgets, widgetIdx);
        const nextActive = getNextActiveWidget(activeWidget, instanceId, nextWidgets);

        this.state$.next({
            ...prev,
            widgets: nextWidgets,
            activeWidget: nextActive
        });

        return instance;
    }

    setActiveWidget(instanceId: string): void {
        const prev = this.state$.value;

        const widget = prev.widgets.find((w) => w.id === instanceId) || null;

        if (widget) {
            this.state$.next({
                ...prev,
                activeWidget: widget
            });
        }
    }

    getMoveControls(instance: WidgetInstance) {
        const prev = this.state$.value;
        const { widgets } = prev;

        const widgetCount = widgets.length;
        const widgetIdx = findIndex(widgets, (w) => w.id === instance.id);

        return {
            canMoveLeft: widgetCount > 1 && widgetIdx > 0,
            moveLeft: () => this.swapWidgets(widgetIdx, widgetIdx - 1),
            canMoveRight: widgetCount > 1 && widgetIdx < widgetCount - 1,
            moveRight: () => this.swapWidgets(widgetIdx, widgetIdx + 1)
        };
    }

    private swapWidgets(idx1: number, idx2: number): void {
        const prev = this.state$.value;
        const { widgets } = prev;

        this.state$.next({
            ...prev,
            widgets: swapIndices(widgets, idx1, idx2)
        });
    }
}
