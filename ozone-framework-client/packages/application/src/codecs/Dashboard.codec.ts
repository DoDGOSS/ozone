import { DashboardUpdateRequest } from "../api/models/DashboardDTO";
import { UserDashboardDTO, UserDashboardStackDTO } from "../api/models/UserDashboardDTO";
import { UserWidgetDTO } from "../api/models/UserWidgetDTO";
import { DashboardNode } from "../components/widget-dashboard/types";
import { Dashboard, DashboardLayout, DashboardProps } from "../models/Dashboard";
import {
    ExpandoPanel,
    FitPanel,
    isExpandoPanelState,
    isTabbedPanelState,
    LayoutType,
    Panel,
    PanelState,
    TabbedPanel
} from "../models/panel";
import { Stack } from "../models/Stack";
import { UserWidget } from "../models/UserWidget";
import { WidgetInstance } from "../models/WidgetInstance";
<<<<<<< HEAD
=======
import { optional, uuid, values } from "../utility";
>>>>>>> 1615b4d... Squashed - OMP integration

import { userWidgetFromJson } from "./UserWidget.codec";

import { optional, uuid, values } from "../utility";
export interface UserState {
    dashboards: Dictionary<Dashboard>;
    stacks: NumericDictionary<Stack>;
    widgets: NumericDictionary<UserWidget>;
}

export interface WidgetInstanceDTO {
    id: string;
    userWidgetId: number;
}

export interface PanelDTO {
    id: string;
    title: string;
    type: LayoutType;
    widgets: WidgetInstanceDTO[];
    activeWidgetId?: string;
    collapsed?: boolean[];
}

export interface DashboardLayoutDTO {
    tree: DashboardNode | null;
    panels: PanelDTO[];
    backgroundWidgets: WidgetInstanceDTO[];
}

export function deserializeUserState(dashboards: UserDashboardDTO[], userWidgets: UserWidgetDTO[]): UserState {
    return new UserStateDeserializer().deserialize(dashboards, userWidgets);
}

class UserStateDeserializer {
    private dashboards: Dictionary<Dashboard> = {};
    private stacks: NumericDictionary<Stack> = {};
    private widgets: NumericDictionary<UserWidget> = {};

    deserialize(dashboards: UserDashboardDTO[], userWidgets: UserWidgetDTO[]): UserState {
        userWidgets.forEach((userWidget) => this.addWidget(userWidget));

        dashboards.forEach((dashboard) => {
            if (dashboard.stack) {
                // TODO create a new stack for any orphaned dashboards.
                this.addStack(dashboard.stack);
                this.addDashboard(dashboard);
            }
        });

        return {
            dashboards: this.dashboards,
            stacks: this.stacks,
            widgets: this.widgets
        };
    }

    private addWidget(userWidget: UserWidgetDTO) {
        const _userWidget = userWidgetFromJson(userWidget);

        this.widgets[_userWidget.id] = _userWidget;
    }

    private addStack(stack: UserDashboardStackDTO) {
        if (stack.id in this.stacks) return;

        const _stack = new Stack({
            approved: stack.approved,
            dashboards: {},
            description: optional(stack.description),
            descriptorUrl: optional(stack.descriptorUrl),
            id: stack.id,
            imageUrl: optional(stack.imageUrl),
            name: stack.name,
            owner: optional(stack.owner),
            context: stack.stackContext
        });

        this.stacks[_stack.id] = _stack;
    }

    private addDashboard(dto: UserDashboardDTO) {
        const stack = this.stacks[dto.stack.id];
        if (stack === undefined) {
            throw new Error("No stack?");
        }

        const layout = JSON.parse(dto.layoutConfig) as DashboardLayoutDTO;

        const panels: Dictionary<Panel<any>> = {};
        for (const panel of layout.panels) {
            const _panel = this.createPanel(panel);
            panels[_panel.id] = _panel;
        }

        const backgroundWidgets = layout.backgroundWidgets
            ? layout.backgroundWidgets.map(this.createWidgetInstance)
            : [];

        const props: DashboardProps = {
            backgroundWidgets,
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
            stackId: stack.id,
            tree: layout.tree,
            user: {
                username: dto.user.username
            }
        };

        const _dashboard = new Dashboard(props);

        this.dashboards[_dashboard.guid] = _dashboard;
        stack.dashboards[_dashboard.guid] = _dashboard;
    }

    private createPanel(dto: PanelDTO): Panel<PanelState> {
        const widgets = dto.widgets.map(this.createWidgetInstance);

        switch (dto.type) {
            case "fit":
                return new FitPanel({
                    id: dto.id,
                    title: dto.title,
                    widget: widgets[0]
                });
            case "tabbed":
                return new TabbedPanel({
                    id: dto.id,
                    title: dto.title,
                    widgets,
                    activeWidget: widgets.find((w) => w.id === dto.activeWidgetId)
                });
            case "accordion":
                return new ExpandoPanel("accordion", {
                    id: dto.id,
                    title: dto.title,
                    widgets,
                    collapsed: dto.collapsed
                });
            case "portal":
                return new ExpandoPanel("portal", {
                    id: dto.id,
                    title: dto.title,
                    widgets,
                    collapsed: dto.collapsed
                });
        }
    }

    private createWidgetInstance = (dto: WidgetInstanceDTO): WidgetInstance => {
        const userWidget = this.widgets[dto.userWidgetId];
        return WidgetInstance.create(userWidget, dto.id);
    };
}

export function dashboardToCreateRequest(dashboard: Dashboard): DashboardUpdateRequest {
    const state = dashboard.state().value;

    return {
        dashboardPosition: state.position,
        description: state.description,
        guid: uuid(),
        iconImageUrl: state.imageUrl,
        isdefault: state.isDefault,
        layoutConfig: JSON.stringify(dashboardLayoutToJson(state)),
        locked: state.isLocked,
        name: state.name
    };
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
        locked: state.isLocked,
        name: state.name
    };
}

export function dashboardLayoutToJson(state: DashboardLayout): DashboardLayoutDTO {
    return {
        tree: state.tree,
        panels: values(state.panels).map(panelToJson),
        backgroundWidgets: state.backgroundWidgets.map(widgetInstanceToJson)
    };
}

export function panelToJson(panel: Panel<PanelState>): PanelDTO {
    if (panel.state) {
        const state = panel.state().value;
        return {
            id: state.id,
            title: state.title,
            type: state.type,
            widgets: state.widgets.filter((instance) => instance.userWidget !== undefined).map(widgetInstanceToJson),
            activeWidgetId: getActiveWidgetId(state),
            collapsed: isExpandoPanelState(state) ? state.collapsed : undefined
        };
    } else {
        // copy of dashboard has no state
        return {
            id: panel.id,
            title: "",
            type: panel.type,
            widgets: [],
            activeWidgetId: undefined,
            collapsed: undefined
        };
    }
}

export function widgetInstanceToJson(instance: WidgetInstance): WidgetInstanceDTO {
    return {
        id: instance.id,
        userWidgetId: instance.userWidget.id
    };
}

function getActiveWidgetId(state: PanelState): string | undefined {
    return (isTabbedPanelState(state) || isExpandoPanelState(state)) && state.activeWidget !== null
        ? state.activeWidget.id
        : undefined;
}
