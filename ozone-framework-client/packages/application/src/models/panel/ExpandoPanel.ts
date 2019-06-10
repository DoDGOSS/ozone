import { clone, findIndex, isArray } from "lodash";

import { AddWidgetsOpts, PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";
import { WidgetInstance } from "../WidgetInstance";

import { getNextActiveWidget } from "./common";
import { omitIndex, swapIndices, uuid } from "../../utility";

export interface ExpandoPanelState extends PanelState {
    collapsed: boolean[];
    activeWidget: WidgetInstance | null;
}

export interface ExpandoPanelOpts {
    id?: string;
    title?: string;
    widgets?: WidgetInstance[];
    collapsed?: boolean[];
    activeWidget?: WidgetInstance;
}

export class ExpandoPanel extends AbstractPanel<ExpandoPanelState> {
    constructor(type: "accordion" | "portal", opts: ExpandoPanelOpts = {}) {
        super({
            id: opts.id || uuid(),
            title: opts.title || "",
            type,
            widgets: opts.widgets || [],
            collapsed: calcCollapsed(opts.widgets, opts.collapsed),
            activeWidget: opts.activeWidget || null
        });
    }

    setCollapsed(instanceId: string, value: boolean): void {
        const prev = this.state$.value;
        const { widgets, collapsed } = prev;

        const widgetIdx = findIndex(widgets, (w) => w.id === instanceId);
        const nextCollapsed = clone(collapsed);
        nextCollapsed[widgetIdx] = value;

        this.state$.next({
            ...prev,
            collapsed: nextCollapsed
        });
    }

    addWidgets(instance: WidgetInstance | WidgetInstance[], opts?: AddWidgetsOpts): void {
        const prev = this.state$.value;
        const { widgets } = prev;

        const instances = !isArray(instance) ? [instance] : instance;

        this.state$.next({
            ...prev,
            widgets: [...widgets, ...instances]
        });

        if (opts && opts.onSuccess) opts.onSuccess();
    }

    closeWidget(instanceId: string): WidgetInstance | undefined {
        const prev = this.state$.value;
        const { activeWidget, widgets, collapsed } = prev;

        const widgetIdx = findIndex(widgets, (w) => w.id === instanceId);
        const instance = widgets[widgetIdx];

        const nextWidgets = omitIndex(widgets, widgetIdx);
        const nextCollapsed = omitIndex(collapsed, widgetIdx);
        const nextActive = getNextActiveWidget(activeWidget, instanceId, nextWidgets);

        this.state$.next({
            ...prev,
            widgets: nextWidgets,
            collapsed: nextCollapsed,
            activeWidget: nextActive
        });

        return instance;
    }

    getMoveControls(instance: WidgetInstance) {
        const prev = this.state$.value;
        const { widgets } = prev;

        const widgetCount = widgets.length;
        const widgetIdx = findIndex(widgets, (w) => w.id === instance.id);

        return {
            canMoveUp: widgetCount > 1 && widgetIdx > 0,
            moveUp: () => this.swapWidgets(widgetIdx, widgetIdx - 1),
            canMoveDown: widgetCount > 1 && widgetIdx < widgetCount - 1,
            moveDown: () => this.swapWidgets(widgetIdx, widgetIdx + 1)
        };
    }

    private swapWidgets(idx1: number, idx2: number): void {
        const prev = this.state$.value;
        const { collapsed, widgets } = prev;

        this.state$.next({
            ...prev,
            widgets: swapIndices(widgets, idx1, idx2),
            collapsed: swapIndices(collapsed, idx1, idx2)
        });
    }
}

function calcCollapsed(widgets: WidgetInstance[] = [], collapsed: boolean[] = []) {
    if (collapsed.length === 0 || widgets.length !== collapsed.length) {
        return Array(widgets.length).fill(false);
    }
    return collapsed;
}
