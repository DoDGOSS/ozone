import { PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";
import { WidgetInstance } from "../WidgetInstance";

import { uuid } from "../../utility";

export interface FitPanelOpts {
    id?: string;
    title?: string;
    widget?: WidgetInstance;
}

export class FitPanel extends AbstractPanel<PanelState> {
    constructor(opts: FitPanelOpts = {}) {
        super({
            id: opts.id || uuid(),
            title: calcTitle(opts.title, opts.widget),
            type: "fit",
            widgets: opts.widget ? [opts.widget] : []
        });
    }

    closeWidget(): WidgetInstance | undefined {
        const prev = this.state$.value;

        const instance = prev.widgets.length > 0 ? prev.widgets[0] : undefined;

        this.state$.next({
            ...prev,
            widgets: []
        });

        return instance;
    }
}

function calcTitle(title?: string, widget?: WidgetInstance): string {
    if (title) return title;
    if (widget) return widget.userWidget.title;
    return "";
}
