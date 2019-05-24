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

    closeWidget(): void {
        const prev = this.state$.value;

        this.state$.next({
            ...prev,
            widgets: []
        });
    }
}

function calcTitle(title?: string, widget?: WidgetInstance): string {
    if (title) return title;
    if (widget) return widget.userWidget.title;
    return "";
}
