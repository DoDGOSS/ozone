import { isArray } from "lodash";

import { uuid } from "../../utility";
import { errorStore } from "../../services/ErrorStore";
import { showReplaceWidgetDialog } from "../../components/widget-dashboard/internal/ReplaceWidgetDialog";

import { WidgetInstance } from "../WidgetInstance";

import { AddWidgetsOpts, PanelState } from "./types";
import { AbstractPanel } from "./AbstractPanel";

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

    addWidgets(instance: WidgetInstance | WidgetInstance[], opts?: AddWidgetsOpts): void {
        const prev = this.state$.value;
        const instances = !isArray(instance) ? [instance] : instance;

        if (instances.length === 0) {
            errorStore.notice("Invalid Widget Move", "There are no Widgets available to move into the Fit Panel.");
            if (opts && opts.onFailure) opts.onFailure();
            return;
        }

        if (instances.length > 1) {
            errorStore.notice("Invalid Widget Move", "A Fit Panel may only contain a single Widget.");
            if (opts && opts.onFailure) opts.onFailure();
            return;
        }

        const nextWidget = instances[0];

        if (prev.widgets.length > 0) {
            showReplaceWidgetDialog({
                onConfirm: () => {
                    this.replaceWidget(nextWidget, opts);
                },
                onCancel: () => {
                    if (opts && opts.onFailure) opts.onFailure();
                }
            });
            return;
        }

        this.replaceWidget(nextWidget, opts);
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

    private replaceWidget(instance: WidgetInstance, opts?: AddWidgetsOpts): void {
        const prev = this.state$.value;

        this.state$.next({
            ...prev,
            title: instance.userWidget.title,
            widgets: [instance]
        });
        if (opts && opts.onSuccess) opts.onSuccess();
    }
}

function calcTitle(title?: string, widget?: WidgetInstance): string {
    if (title) return title;
    if (widget) return widget.userWidget.title;
    return "";
}
