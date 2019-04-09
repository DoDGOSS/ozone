import uuid from "uuid/v4";

import { UserWidget } from "../UserWidget";

import { PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";

export class FitPanel extends AbstractPanel<PanelState> {
    constructor(id: string | null, widget: UserWidget | null = null, title: string | null = null) {
        super({
            id: id || uuid(),
            title: title ? title : widget ? widget.widget.title : "",
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
