import { findIndex, isArray, last } from "lodash";

import { PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";
import { WidgetInstance } from "../WidgetInstance";

import { getNextActiveWidget } from "./common";
import { omitIndex, uuid } from "../../utility";

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

    addWidget(instance: WidgetInstance | WidgetInstance[]): void {
        const prev = this.state$.value;
        const { activeWidget, widgets } = prev;

        const instances = !isArray(instance) ? [instance] : instance;

        this.state$.next({
            ...prev,
            widgets: [...widgets, ...instances],
            activeWidget: last(instances) || activeWidget
        });
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

        this.state$.next({
            ...prev,
            activeWidget: widget
        });
    }
}
