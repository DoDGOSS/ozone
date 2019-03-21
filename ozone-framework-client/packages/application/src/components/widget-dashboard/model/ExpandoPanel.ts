import { LayoutType, PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";
import { ObservableWidget } from "./ObservableWidget";

import { clone, findIndex } from "lodash";
import { getNextActiveWidget } from "./common";
import { omitIndex } from "../../../utility";
import uuid from "uuid/v4";

export interface ExpandoPanelState extends PanelState {
    collapsed: boolean[];
    activeWidget: ObservableWidget | null;
}

export class ExpandoPanel extends AbstractPanel<ExpandoPanelState> {
    constructor(
        id: string | null,
        title: string,
        type: "accordion" | "portal",
        widgets: ObservableWidget[] = [],
        collapsed: boolean[] = [],
        activeWidget: ObservableWidget | null = null
    ) {
        super({
            id: id || uuid(),
            title,
            type: type as LayoutType,
            widgets,
            collapsed: widgets.length === collapsed.length ? collapsed : Array(widgets.length).fill(false),
            activeWidget
        });
    }

    setCollapsed = (widgetId: string, value: boolean): void => {
        const prev = this.state$.value;
        const { widgets, collapsed } = prev;

        const widgetIdx = findIndex(widgets, (w) => w.id === widgetId);
        const nextCollapsed = clone(collapsed);
        nextCollapsed[widgetIdx] = value;

        this.state$.next({
            ...prev,
            collapsed: nextCollapsed
        });
    };

    closeWidget = (widgetId: string): void => {
        const prev = this.state$.value;
        const { activeWidget, widgets, collapsed } = prev;

        const widgetIdx = findIndex(widgets, (w) => w.id === widgetId);
        const nextWidgets = omitIndex(widgets, widgetIdx);
        const nextCollapsed = omitIndex(collapsed, widgetIdx);
        const nextActive = getNextActiveWidget(activeWidget, widgetId, nextWidgets);

        this.state$.next({
            ...prev,
            widgets: nextWidgets,
            collapsed: nextCollapsed,
            activeWidget: nextActive
        });
    };
}
