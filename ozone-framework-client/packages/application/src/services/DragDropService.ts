import { cloneDeep, isEqual } from "lodash";

import { DashboardNode } from "../components/widget-dashboard/types";
import { Dashboard, DashboardProps } from "../models/Dashboard";
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
        const { userWidgetId } = dragData;
        const { path: targetPath, position } = dropData;

        this.dashboardService.addUserWidgetById(userWidgetId, targetPath, position);
    }

    private handleInstanceDropEvent(dragData: InstanceDragData, dropData: DropData): void {
        if (this.isMosaicDrop(dropData)) {
            this.moveInstanceToMosaic(dragData, dropData);
        } else {
            this.moveInstanceToPanel(dragData, dropData);
        }
    }

    private moveWindowToMosaic(dragData: WindowDragData, dropData: DropData): void {
        const { position, path: targetPath } = dropData;
        const { path: sourcePath } = dragData;

        if (position == null || targetPath == null || isEqual(targetPath, sourcePath)) {
            this.restoreSnapshot();
            return;
        }

        this.dashboardService.moveWindowToMosaic(sourcePath, targetPath, position);
    }

    private moveWindowToPanel(dragData: WindowDragData, dropData: DropData): void {
        const { path: sourcePath } = dragData;
        const { path: targetPath } = dropData;

        if (!targetPath) return;

        this.dashboardService.moveWindowToPanel(sourcePath, targetPath, () => this.restoreSnapshot());
    }

    private moveInstanceToMosaic(dragData: InstanceDragData, dropData: DropData): void {
        const { widgetInstanceId } = dragData;
        const { path, position } = dropData;

        this.dashboardService.moveInstanceToMosaic(widgetInstanceId, path, position);
    }

    private moveInstanceToPanel(dragData: InstanceDragData, dropData: DropData): void {
        const { widgetInstanceId } = dragData;
        const { path: targetPath } = dropData;

        if (!targetPath) return;

        this.dashboardService.moveInstanceToPanel(widgetInstanceId, targetPath);
    }
}

export const dragDropService = new DragDropService();
