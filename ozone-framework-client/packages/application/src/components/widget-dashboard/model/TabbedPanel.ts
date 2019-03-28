import { PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";
import { ObservableWidget } from "./ObservableWidget";

import { findIndex } from "lodash";
import { omitIndex } from "../../../utility";
import { getNextActiveWidget } from "./common";
import uuid from "uuid/v4";

export interface TabbedPanelState extends PanelState {
    activeWidget: ObservableWidget | null;
}

export class TabbedPanel extends AbstractPanel<TabbedPanelState> {
    constructor(
        id: string | null,
        title: string,
        widgets: ObservableWidget[] = [],
        activeWidget: ObservableWidget | null = null
    ) {
        super({
            id: id || uuid(),
            title,
            type: "tabbed",
            widgets,
            activeWidget: activeWidget == null && widgets.length > 0 ? widgets[0] : null
        });
    }

    closeWidget = (widgetId: string): void => {
        const prev = this.state$.value;
        const { activeWidget, widgets } = prev;

        const widgetIdx = findIndex(widgets, (w) => w.id === widgetId);
        const nextWidgets = omitIndex(widgets, widgetIdx);
        const nextActive = getNextActiveWidget(activeWidget, widgetId, nextWidgets);

        this.state$.next({
            ...prev,
            widgets: nextWidgets,
            activeWidget: nextActive
        });
    };

    setActiveWidget = (widgetId: string): void => {
        const prev = this.state$.value;

        const widget = prev.widgets.find((w) => w.id === widgetId) || null;

        this.state$.next({
            ...prev,
            activeWidget: widget
        });
    };
}
