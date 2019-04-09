import { findIndex } from "lodash";
import uuid from "uuid/v4";

import { UserWidget } from "../UserWidget";

import { PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";

import { omitIndex } from "../../utility";
import { getNextActiveWidget } from "./common";

export interface TabbedPanelState extends PanelState {
    activeWidget: UserWidget | null;
}

export class TabbedPanel extends AbstractPanel<TabbedPanelState> {
    constructor(id: string | null, title: string, widgets: UserWidget[] = [], activeWidget: UserWidget | null = null) {
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

        const widgetIdx = findIndex(widgets, (w) => w.widget.id === widgetId);
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

        const widget = prev.widgets.find((w) => w.widget.id === widgetId) || null;

        this.state$.next({
            ...prev,
            activeWidget: widget
        });
    };
}
