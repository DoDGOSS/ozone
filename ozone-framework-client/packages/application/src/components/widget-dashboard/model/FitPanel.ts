import { PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";
import { ObservableWidget } from "./ObservableWidget";

import uuid from "uuid/v4";

export class FitPanel extends AbstractPanel<PanelState> {
    constructor(id: string | null, widget: ObservableWidget | null = null) {
        super({
            id: id || uuid(),
            title: widget ? widget.definition.title : "",
            type: "fit",
            widgets: widget ? [widget] : []
        });
    }

    closeWidget = (): void => {
        const prev = this.state$.value;

        this.state$.next({
            ...prev,
            widgets: []
        });
    };
}
