import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import {
    Corner,
    getNodeAtPath,
    getOtherDirection,
    getPathToCorner,
    MosaicDirection,
    MosaicNode,
    MosaicParent,
    updateTree
} from "react-mosaic-component";

import { Dashboard, DashboardNode, Widget } from "./interfaces";
import { dashboardStore, DashboardStore } from "./DashboardStore";

import { dropRight, isString, pick } from "lodash";

export class DashboardService {

    private readonly store: DashboardStore;

    private readonly isConfirmationDialogVisible$ = new BehaviorSubject(false);
    private replaceWidgetCallback?: () => void;

    constructor(store?: DashboardStore) {
        this.store = store || dashboardStore;
    }

    isConfirmationDialogVisible = () => asBehavior(this.isConfirmationDialogVisible$);

    showConfirmationDialog = (callback: () => void) => {
        this.isConfirmationDialogVisible$.next(true);
        this.replaceWidgetCallback = callback;
    };

    cancelReplaceWidget = () => {
        this.isConfirmationDialogVisible$.next(false);

        this.replaceWidgetCallback = undefined;
    };

    confirmReplaceWidget = () => {
        this.isConfirmationDialogVisible$.next(false);

        if (this.replaceWidgetCallback) this.replaceWidgetCallback();
        this.replaceWidgetCallback = undefined;
    };

    setLayout = (dashboardNode: DashboardNode | null) => {
        const dashboard = this.store.currentDashboard();
        if (!dashboard) {
            console.warn("Failed to set Dashboard layout: no Dashboard is available");
            return;
        }

        this.store.setDashboard({
            ...dashboard,
            widgets: pick(dashboard.widgets, findWidgetIds(dashboardNode)),
            layout: dashboardNode
        });
    };

    addWidget = (widget: Widget) => {
        const dashboard = this.store.currentDashboard();
        if (!dashboard) {
            console.warn("Failed to add Widget to Dashboard: no Dashboard is available");
            return;
        }

        switch (dashboard.type) {
            case "fit":
                this.addFitWidget(dashboard, widget);
                return;
            case "tile":
                this.addTileWidget(dashboard, widget);
                return;
        }
    };

    addFitWidget = (dashboard: Dashboard, widget: Widget) => {
        if (dashboard.layout == null) {
            dashboard.widgets[widget.id] = widget;
            this.setLayout(widget.id);
            return;
        }

        this.showConfirmationDialog(() => {
            dashboard.widgets[widget.id] = widget;
            this.setLayout(widget.id);
        });
    };

    addTileWidget = (dashboard: Dashboard, widget: Widget) => {
        dashboard.widgets[widget.id] = widget;

        const { layout } = dashboard;
        if (!layout) {
            this.setLayout(widget.id);
        } else {
            this.addToTopRight(layout, widget);
        }
    };

    private addToTopRight = (layout: DashboardNode, widget: Widget) => {
        const path = getPathToCorner(layout, Corner.TOP_RIGHT);
        const parent = getNodeAtPath(layout, dropRight(path)) as MosaicParent<string>;
        const destination = getNodeAtPath(layout, path) as MosaicNode<string>;
        const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : "row";
        let first: MosaicNode<string>;
        let second: MosaicNode<string>;
        if (direction === "row") {
            first = destination;
            second = widget.id;
        } else {
            first = widget.id;
            second = destination;
        }

        const update = {
            path,
            spec: {
                $set: {
                    direction,
                    first,
                    second
                }
            }
        };

        const updatedLayout = updateTree(layout, [update]);

        this.setLayout(updatedLayout);
    };
}

export const dashboardService = new DashboardService();


function findWidgetIds(node: DashboardNode | null): string[] {
    if (node === null) return [];
    if (isString(node)) return [node];
    return [...findWidgetIds(node.first), ...findWidgetIds(node.second)];
}
