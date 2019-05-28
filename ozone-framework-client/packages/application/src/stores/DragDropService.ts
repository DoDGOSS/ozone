import { dropRight, isEqual } from "lodash";

import { dashboardStore, DashboardStore } from "./DashboardStore";
import { isTabbedPanel } from "../models/panel";
import { Dashboard } from "../models/Dashboard";
import { WidgetInstance } from "../models/WidgetInstance";
import {
    DragData,
    DragDataType,
    DropData,
    DropDataType,
    InstanceDragData,
    MosaicDropData,
    WidgetDragData,
    WindowDragData
} from "../shared/dragAndDrop";
import { MosaicPath, MosaicUpdate } from "../features/MosaicDashboard/types";
import { createDragToUpdates, updateTree } from "../features/MosaicDashboard/util/mosaicUpdates";
import { dashboardService, DashboardService } from "./DashboardService";

export class DragDropService {
    private readonly dashboardStore: DashboardStore;
    private readonly dashboardService: DashboardService;

    constructor(_dashboardStore?: DashboardStore, _dashboardService?: DashboardService) {
        this.dashboardStore = _dashboardStore || dashboardStore;
        this.dashboardService = _dashboardService || dashboardService;
    }

    handleDropEvent(dragData: DragData | undefined, dropData: DropData): void {
        if (!dragData) return;
        switch (dragData.type) {
            case DragDataType.WINDOW:
                return this.handleWindowDropEvent(dragData, dropData);
            case DragDataType.WIDGET:
                return this.handleWidgetDropEvent(dragData, dropData);
            case DragDataType.INSTANCE:
                return this.handleInstanceDropEvent(dragData, dropData);
        }
    }

    private getCurrentDashboard(): Dashboard {
        const dashboard = this.dashboardStore.currentDashboard().value;
        if (dashboard === null) {
            throw new Error("No Dashboard is available");
        }
        return dashboard;
    }

    private handleWindowDropEvent(dragData: WindowDragData, dropData: DropData): void {
        switch (dropData.type) {
            case DropDataType.MOSAIC:
                this.moveWindowInMosaic(dragData, dropData);
                break;
            case DropDataType.TABLIST:
                this.moveWindowToTabbedPanel(dragData.path, dropData.panelId, dropData.index);
                break;
        }
    }

    private handleWidgetDropEvent(dragData: WidgetDragData, dropData: DropData): void {
        switch (dropData.type) {
            case DropDataType.MOSAIC:
                this.dashboardService.addUserWidgetById(dragData.userWidgetId, dropData.path, dropData.position);
                break;
            case DropDataType.TABLIST:
                this.addWidgetToTabbedPanel(dragData.userWidgetId, dropData.panelId, dropData.index);
                break;
        }
    }

    private handleInstanceDropEvent(dragData: InstanceDragData, dropData: DropData): void {
        switch (dropData.type) {
            case DropDataType.MOSAIC:
                this.moveInstanceToMosaic(dragData, dropData);
                break;
            case DropDataType.TABLIST:
                break;
        }
    }

    private moveInstanceToMosaic(dragData: InstanceDragData, dropData: MosaicDropData): void {
        const { widgetInstanceId } = dragData;
        const { path, position } = dropData;
        const panel = this.dashboardService.findPanelByWidgetId(widgetInstanceId);
        if (!panel) return;

        const instance = panel.closeWidget(widgetInstanceId);
        if (!instance) return;

        this.dashboardService.addWidgetInstance({ instance, path, position });
    }


    private addWidgetToTabbedPanel(
        userWidgetId: number,
        panelId: string | undefined,
        tabIndex: number | undefined
    ): void {
        if (!panelId) return;

        const userWidget = dashboardStore.findUserWidgetById(userWidgetId);
        if (!userWidget) return;

        const panel = this.dashboardService.getPanelById(panelId);
        if (!panel || !isTabbedPanel(panel)) return;

        const widgetInstance = WidgetInstance.create(userWidget);

        panel.addWidget(widgetInstance);
    }

    private moveWindowInMosaic(dragData: WindowDragData, dropData: MosaicDropData): void {
        const dashboard = this.getCurrentDashboard();
        const layout = dashboard.state().value.tree;
        if (!layout) return;

        const { position, path: targetPath } = dropData;
        const sourcePath = dragData.path;

        let updates: MosaicUpdate<string>[];
        if (position != null && targetPath != null && !isEqual(targetPath, sourcePath)) {
            updates = createDragToUpdates(layout, sourcePath, targetPath, position);
        } else {
            updates = [
                {
                    path: dropRight(sourcePath),
                    spec: { splitPercentage: { $set: null } }
                }
            ];
        }
        const newLayout = updateTree(layout, updates);

        this.dashboardService.setLayout(newLayout);
    }

    private moveWindowToTabbedPanel(windowPath: MosaicPath, panelId: string | undefined, tabIndex: number | undefined) {
        if (!panelId) return;

        const dashboard = this.getCurrentDashboard();
        const layout = dashboard.state().value.tree;
        if (!layout) return;

        const sourcePanel = dashboard.getPanelByPath(windowPath);
        if (!sourcePanel) return;
        const widgets = sourcePanel.state().value.widgets;

        const targetPanel = dashboard.getPanelById(panelId);
        if (!targetPanel || !isTabbedPanel(targetPanel)) return;

        dashboard.removeNode(windowPath);
        targetPanel.addWidget(widgets);
    }
}

export const dragDropService = new DragDropService();
