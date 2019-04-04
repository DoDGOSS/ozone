import { keyBy, values } from "lodash";

import { DashboardUpdateRequest } from "../api/models/DashboardDTO";
import { UserDashboardDTO } from "../api/models/UserDashboardDTO";
import { UserWidgetDTO } from "../api/models/UserWidgetDTO";

import { UserWidget } from "../models/UserWidget";

import { FitPanel } from "../models/dashboard/FitPanel";
import { TabbedPanel } from "../models/dashboard/TabbedPanel";
import { ExpandoPanel } from "../models/dashboard/ExpandoPanel";
import { Dashboard, DashboardProps } from "../models/dashboard/Dashboard";
import { isExpandoPanelState, isTabbedPanelState, LayoutType, Panel, PanelState } from "../models/dashboard/types";

import { DashboardNode } from "../components/widget-dashboard/types";

import { userWidgetFromJson } from "./UserWidget.codec";

import { optional } from "../utility";

export type DashboardMap = { [id: string]: Dashboard };
export type UserWidgetMap = { [id: number]: UserWidget };

export interface UserDashboardsState {
    dashboards: DashboardMap;
    widgets: UserWidgetMap;
}

export interface PanelDTO {
    id: string;
    title: string;
    type: LayoutType;
    userWidgetIds: number[];
    activeWidgetId?: number;
    collapsed?: boolean[];
}

export interface DashboardLayoutDTO {
    tree: DashboardNode | null;
    panels: PanelDTO[];
}

export function userDashboardsFromJson(
    dashboardDtos: UserDashboardDTO[],
    widgetDtos: UserWidgetDTO[]
): UserDashboardsState {
    const widgets: UserWidgetMap = keyBy(widgetDtos.map(userWidgetFromJson), "id");
    const dashboards: DashboardMap = keyBy(
        dashboardDtos.map((dashboard) => dashboardFromJson(dashboard, widgets)),
        "guid"
    );

    return {
        dashboards,
        widgets
    };
}

export function dashboardFromJson(dto: UserDashboardDTO, widgets: UserWidgetMap): Dashboard {
    const layout = JSON.parse(dto.layoutConfig) as DashboardLayoutDTO;
    const panels = keyBy(layout.panels.map((panel) => panelFromJson(panel, widgets)), "id");

    const props: DashboardProps = {
        description: optional(dto.description),
        guid: dto.guid,
        imageUrl: optional(dto.iconImageUrl),
        isAlteredByAdmin: dto.alteredByAdmin,
        isDefault: dto.isdefault,
        isGroupDashboard: dto.isGroupDashboard,
        isLocked: dto.locked,
        isMarkedForDeletion: dto.markedForDeletion,
        isPublishedToStore: dto.publishedToStore,
        name: dto.name,
        panels,
        position: dto.dashboardPosition,
        stack: optional(dto.stack),
        tree: layout.tree,
        user: {
            username: dto.user.username
        }
    };

    return new Dashboard(props);
}

export function dashboardToUpdateRequest(dashboard: Dashboard): DashboardUpdateRequest {
    const state = dashboard.state().value;

    return {
        dashboardPosition: state.position,
        description: state.description,
        guid: state.guid,
        iconImageUrl: state.imageUrl,
        isdefault: state.isDefault,
        layoutConfig: JSON.stringify(dashboardLayoutToJson(state)),
        name: state.name
    };
}

export function dashboardLayoutToJson(state: DashboardProps): DashboardLayoutDTO {
    return {
        tree: state.tree,
        panels: values(state.panels).map(panelToJson)
    };
}

export function panelFromJson(dto: PanelDTO, widgets: UserWidgetMap): Panel<PanelState> {
    const _widgets = dto.userWidgetIds.map((id) => widgets[id]);
    const _activeWidget = dto.activeWidgetId ? widgets[dto.activeWidgetId] : undefined;

    switch (dto.type) {
        case "fit":
            return new FitPanel(dto.id, _widgets[0], dto.title);
        case "tabbed":
            return new TabbedPanel(dto.id, dto.title, _widgets, _activeWidget);
        case "accordion":
            return new ExpandoPanel(dto.id, dto.title, "accordion", _widgets, dto.collapsed);
        case "portal":
            return new ExpandoPanel(dto.id, dto.title, "portal", _widgets, dto.collapsed);
    }
}

export function panelToJson(panel: Panel<PanelState>): PanelDTO {
    const state = panel.state().value;
    return {
        id: state.id,
        title: state.title,
        type: state.type,
        userWidgetIds: state.widgets.map((widget) => widget.id),
        activeWidgetId: getActiveWidgetId(state),
        collapsed: isExpandoPanelState(state) ? state.collapsed : undefined
    };
}

function getActiveWidgetId(state: PanelState): number | undefined {
    return (isTabbedPanelState(state) || isExpandoPanelState(state)) && state.activeWidget !== null
        ? state.activeWidget.id
        : undefined;
}
