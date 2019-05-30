import { cloneDeep, dropRight, isEqual } from "lodash";

import { dashboardStore, DashboardStore } from "./DashboardStore";
import { Dashboard } from "../models/Dashboard";
import { WidgetInstance } from "../models/WidgetInstance";
import {
    DragData,
    DragDataType,
    DropData,
    DropDataType,
    InstanceDragData,
    setSaveSnapshotCallback,
    WidgetDragData,
    WindowDragData
} from "../shared/dragAndDrop";
import { MosaicUpdate } from "../features/MosaicDashboard/types";
import { createDragToUpdates, updateTree } from "../features/MosaicDashboard/util/mosaicUpdates";
import { dashboardService, DashboardService } from "./DashboardService";
import { DashboardNode } from "../components/widget-dashboard/types";

export class DragDropService {
    private readonly dashboardStore: DashboardStore;
    private readonly dashboardService: DashboardService;

    private snapshot: DashboardNode | null = null;

    constructor(_dashboardStore?: DashboardStore, _dashboardService?: DashboardService) {
        this.dashboardStore = _dashboardStore || dashboardStore;
        this.dashboardService = _dashboardService || dashboardService;

        setSaveSnapshotCallback(() => this.saveSnapshot());
    }

    saveSnapshot(): void {
        const dashboard = this.getCurrentDashboard();
        this.snapshot = cloneDeep(dashboard.state().value.tree);
    }

    restoreSnapshot(): void {
        this.dashboardService.setLayout(this.snapshot);
        this.snapshot = null;
    }

    handleDropEvent(dragData: DragData | undefined, dropData: DropData): void {
        if (!dragData || dropData.type !== DropDataType.MOSAIC) return;

        switch (dragData.type) {
            case DragDataType.WINDOW:
                return this.handleWindowDropEvent(dragData, dropData);
            case DragDataType.WIDGET:
                return this.handleWidgetDropEvent(dragData, dropData);
            case DragDataType.INSTANCE:
                return this.handleInstanceDropEvent(dragData, dropData);
        }
    }

    private handleWindowDropEvent(dragData: WindowDragData, dropData: DropData): void {
        if (dropData.position !== "center") {
            this.moveWindowToMosaic(dragData, dropData);
        } else {
            this.moveWindowToPanel(dragData, dropData);
        }
    }

    private handleWidgetDropEvent(dragData: WidgetDragData, dropData: DropData): void {
        if (dropData.position !== "center") {
            this.addWidgetToMosaic(dragData, dropData);
        } else {
            this.addWidgetToPanel(dragData, dropData);
        }
    }

    private handleInstanceDropEvent(dragData: InstanceDragData, dropData: DropData): void {
        if (dropData.type !== "mosaic") return;

        if (dropData.position !== "center") {
            this.moveInstanceToMosaic(dragData, dropData);
        } else {
            this.moveInstanceToPanel(dragData, dropData);
        }
    }

    private getCurrentDashboard(): Dashboard {
        const dashboard = this.dashboardStore.currentDashboard().value;
        if (dashboard === null) {
            throw new Error("No Dashboard is available");
        }
        return dashboard;
    }

    private moveWindowToMosaic(dragData: WindowDragData, dropData: DropData): void {
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

    private moveWindowToPanel(dragData: WindowDragData, dropData: DropData): void {
        if (!dropData.path) return;

        const dashboard = this.getCurrentDashboard();

        const sourcePanel = dashboard.getPanelByPath(dragData.path);
        const targetPanel = this.dashboardService.getPanelByPath(dropData.path);
        if (!sourcePanel || !targetPanel) return;

        const widgetInstances = sourcePanel.state().value.widgets;

        const isSuccess = targetPanel.addWidgets(widgetInstances);
        if (!isSuccess) {
            this.restoreSnapshot();
        }
    }

    private addWidgetToMosaic(dragData: WidgetDragData, dropData: DropData): void {
        this.dashboardService.addUserWidgetById(dragData.userWidgetId, dropData.path, dropData.position);
    }

    private addWidgetToPanel(dragData: WidgetDragData, dropData: DropData): void {
        if (!dropData.path) return;

        const panel = this.dashboardService.getPanelByPath(dropData.path);
        if (!panel) return;

        const userWidget = this.dashboardStore.findUserWidgetById(dragData.userWidgetId);
        if (!userWidget) return;

        const widgetInstance = WidgetInstance.create(userWidget);

        panel.addWidgets(widgetInstance);
    }

    private moveInstanceToMosaic(dragData: InstanceDragData, dropData: DropData): void {
        const { widgetInstanceId } = dragData;
        const { path, position } = dropData;

        const panel = this.dashboardService.findPanelByWidgetId(widgetInstanceId);
        if (!panel) return;

        const instance = panel.closeWidget(widgetInstanceId);
        if (!instance) return;

        this.dashboardService.addWidgetInstance({ instance, path, position });
    }

    private moveInstanceToPanel(dragData: InstanceDragData, dropData: DropData): void {
        if (!dropData.path) return;

        const { widgetInstanceId } = dragData;
        const sourcePanel = this.dashboardService.findPanelByWidgetId(widgetInstanceId);
        if (!sourcePanel) return;

        const targetPanel = this.dashboardService.getPanelByPath(dropData.path);
        if (!targetPanel) return;

        const widgetInstance = sourcePanel.findWidget(widgetInstanceId);
        if (!widgetInstance) return;

        const isSuccess = targetPanel.addWidgets(widgetInstance);
        if (isSuccess) {
            sourcePanel.closeWidget(widgetInstanceId);
        }
    }
}

export const dragDropService = new DragDropService();
