import { cloneDeep, isEqual } from "lodash";

import { DashboardNode } from "../components/widget-dashboard/types";
import { createDragToUpdates, updateTree } from "../features/MosaicDashboard/util/mosaicUpdates";
import { Dashboard, DashboardProps } from "../models/Dashboard";
import { WidgetInstance } from "../models/WidgetInstance";
import {
    DragDataType,
    DropData,
    DropDataType,
    EndDragEvent,
    InstanceDragData,
    setSaveSnapshotCallback,
    WidgetDragData,
    WindowDragData
} from "../shared/dragAndDrop";
import { dashboardStore, DashboardStore } from "../stores/DashboardStore";

import { dashboardService, DashboardService } from "./DashboardService";

export class DragDropService {
    private readonly dashboardStore: DashboardStore;
    private readonly dashboardService: DashboardService;

    private snapshot: DashboardNode | null = null;

    constructor(_dashboardStore?: DashboardStore, _dashboardService?: DashboardService) {
        this.dashboardStore = _dashboardStore || dashboardStore;
        this.dashboardService = _dashboardService || dashboardService;

        setSaveSnapshotCallback(() => this.saveSnapshot());
    }

    saveSnapshot = (): void => {
        this.snapshot = cloneDeep(this.dashboardState.tree);
    };

    restoreSnapshot = (): void => {
        if (!this.snapshot) return;
        this.dashboardService.setLayout(this.snapshot);
        this.snapshot = null;
    };

    canDrag = (): boolean => !this.dashboardState.isLocked;

    handleDropEvent = (event: EndDragEvent<any>): void => {
        const { dragData, dropData, monitor } = event;

        // Restore the snapshot if the drop was not caught by a drop handler
        if (!monitor.didDrop()) {
            this.restoreSnapshot();
            return;
        }

        if (!dragData || dropData.type !== DropDataType.MOSAIC) return;

        switch (dragData.type) {
            case DragDataType.WINDOW:
                this.handleWindowDropEvent(dragData, dropData);
                break;
            case DragDataType.WIDGET:
                this.handleWidgetDropEvent(dragData, dropData);
                break;
            case DragDataType.INSTANCE:
                this.handleInstanceDropEvent(dragData, dropData);
                break;
        }
    };

    private get dashboard(): Dashboard {
        return this.dashboardStore.currentDashboard().value;
    }

    private get dashboardState(): DashboardProps {
        return this.dashboard.state().value;
    }

    private isMosaicDrop(dropData: DropData): boolean {
        return !this.dashboardState.tree || dropData.position !== "center";
    }

    private handleWindowDropEvent(dragData: WindowDragData, dropData: DropData): void {
        if (this.isMosaicDrop(dropData)) {
            this.moveWindowToMosaic(dragData, dropData);
        } else {
            this.moveWindowToPanel(dragData, dropData);
        }
    }

    private handleWidgetDropEvent(dragData: WidgetDragData, dropData: DropData): void {
        if (this.isMosaicDrop(dropData)) {
            this.addWidgetToMosaic(dragData, dropData);
        } else {
            this.addWidgetToPanel(dragData, dropData);
        }
    }

    private handleInstanceDropEvent(dragData: InstanceDragData, dropData: DropData): void {
        if (this.isMosaicDrop(dropData)) {
            this.moveInstanceToMosaic(dragData, dropData);
        } else {
            this.moveInstanceToPanel(dragData, dropData);
        }
    }

    private moveWindowToMosaic(dragData: WindowDragData, dropData: DropData): void {
        const layout = this.dashboardState.tree;
        if (!layout) return;

        const { position, path: targetPath } = dropData;
        const sourcePath = dragData.path;

        if (position == null || targetPath == null || isEqual(targetPath, sourcePath)) {
            this.restoreSnapshot();
            return;
        }
        const updates = createDragToUpdates(layout, sourcePath, targetPath, position);
        const newLayout = updateTree(layout, updates);

        this.dashboardService.setLayout(newLayout);
    }

    private moveWindowToPanel(dragData: WindowDragData, dropData: DropData): void {
        if (!dropData.path) return;

        const dashboard = this.dashboard;

        const sourcePanel = dashboard.getPanelByPath(dragData.path);
        const targetPanel = this.dashboardService.getPanelByPath(dropData.path);
        if (!sourcePanel || !targetPanel) return;

        const widgetInstances = sourcePanel.state().value.widgets;

        targetPanel.addWidgets(widgetInstances, {
            onSuccess: () => dashboard.removeNode(dragData.path),
            onFailure: () => this.restoreSnapshot()
        });
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

        this.dashboardService.addWidget({ widget: instance, path, position });
    }

    private moveInstanceToPanel(dragData: InstanceDragData, dropData: DropData): void {
        if (!dropData.path) return;

        const { widgetInstanceId } = dragData;
        const sourcePanel = this.dashboardService.findPanelByWidgetId(widgetInstanceId);
        if (!sourcePanel) return;

        const targetPanel = this.dashboardService.getPanelByPath(dropData.path);
        if (!targetPanel) return;

        // Ignore drops when the instance is already in the target panel
        if (sourcePanel === targetPanel) return;

        const widgetInstance = sourcePanel.findWidget(widgetInstanceId);
        if (!widgetInstance) return;

        targetPanel.addWidgets(widgetInstance, {
            onSuccess: () => sourcePanel.closeWidget(widgetInstanceId)
        });
    }
}

export const dragDropService = new DragDropService();
