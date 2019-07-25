import { DashboardGuid, PanelId, UserWidgetId, WidgetId, WidgetInstanceId } from "../models/types";
import { PanelState } from "../models/panel";
import { byId, values } from "../utility";
import { UserWidget } from "../models/UserWidget";
import { WidgetInstance } from "../models/WidgetInstance";
import { Dashboard } from "../models/Dashboard";

export interface DesktopState {
    isLoading: boolean;

    userWidgets: Dictionary<UserWidgetRef>;
    userWidgetIds: UserWidgetId[];

    dashboards: Dictionary<DashboardRef>;
    dashboardIds: DashboardGuid[];
    currentDashboardId: DashboardGuid;

    panels: Dictionary<PanelRef>;
    panelIds: PanelId[];

    widgetInstances: Dictionary<WidgetInstanceRef>;
    widgetInstanceIds: WidgetInstanceId[];
}

export function selectUserWidgetIds(desktop: DesktopState): UserWidgetId[] {
    return desktop.userWidgetIds;
}

export function selectWidgetInstanceIds(desktop: DesktopState): WidgetInstanceId[] {
    return desktop.widgetInstanceIds;
}

export interface DashboardRef {
    guid: DashboardGuid;
    panelIds: PanelId[];
}

export function toDashboardRef(dashboard: Dashboard): DashboardRef {
    return {
        guid: dashboard.guid,
        panelIds: values(dashboard.state().value.panels).map(byId)
    };
}

export interface PanelRef {
    id: PanelId;
    widgetInstanceIds: WidgetInstanceId[];
}

export function toPanelRef(panel: PanelState): PanelRef {
    return {
        id: panel.id,
        widgetInstanceIds: panel.widgets.map(byId)
    };
}

export interface WidgetInstanceRef {
    id: WidgetInstanceId;
    userWidgetId: UserWidgetId;
}

export function toWidgetInstanceRef(widgetInstance: WidgetInstance): WidgetInstanceRef {
    return {
        id: widgetInstance.id,
        userWidgetId: widgetInstance.userWidget.id
    };
}

export interface UserWidgetRef {
    id: UserWidgetId;
    widgetId: WidgetId;
}

export function toUserWidgetRef(userWidget: UserWidget): UserWidgetRef {
    return {
        id: userWidget.id,
        widgetId: userWidget.widget.id
    };
}

export interface WidgetRef {
    id: WidgetId;
}
