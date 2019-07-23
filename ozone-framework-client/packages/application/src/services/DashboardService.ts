import { DashboardNode, DashboardPath } from "../components/widget-dashboard/types";
import { MosaicBranch, MosaicPath } from "../features/MosaicDashboard/types";
import { createDragToUpdates, updateTree } from "../features/MosaicDashboard/util/mosaicUpdates";
import { AddWidgetOpts, Dashboard, DashboardProps } from "../models/Dashboard";
import { ExpandoPanel, FitPanel, isExpandoPanel, LayoutType, Panel, PanelState, TabbedPanel } from "../models/panel";
import { UserWidget } from "../models/UserWidget";
import { Widget } from "../models/Widget";
import { WidgetInstance } from "../models/WidgetInstance";
import { MosaicDropTargetPosition } from "../shared/dragAndDrop";
import { dashboardStore, DashboardStore } from "../stores/DashboardStore";
import { hasSameId, isNil, Predicate, values } from "../utility";

import { authService } from "./AuthService";
import { errorStore } from "./ErrorStore";
import { WidgetLaunchArgs } from "./widget-api/WidgetLaunchArgs";

export class DashboardService {
    private readonly store: DashboardStore;

    constructor(store?: DashboardStore) {
        this.store = store || dashboardStore;
    }

    private get dashboard(): Dashboard {
        return this.store.currentDashboard().value;
    }

    private get dashboardState(): DashboardProps {
        return this.dashboard.state().value;
    }

    getPanelByPath(path: MosaicPath): Panel | null {
        return this.dashboard.getPanelByPath(path);
    }

    findPanelByWidgetInstanceId(instanceId: string): Panel | null {
        const dashboard = this.store.currentDashboard().value;
        if (dashboard === null) return null;

        const panels = dashboard.state().value.panels;
        for (const panel of values(panels)) {
            if (panel.findWidget(instanceId)) return panel;
        }

        return null;
    }

    setLayout = (tree: DashboardNode | null) => {
        this.dashboard.setLayout(tree);
    };

    setLayoutFast = (tree: DashboardNode | null) => {
        this.dashboard.setLayoutFast(tree);
    };

    setPanelLayout = (panel: Panel<PanelState>, path: DashboardPath, layout: LayoutType) => {
        this.dashboard.setPanelLayout(panel, path, layout);
    };

    /**
     * Add a UserWidget or WidgetInstance to the current Dashboard
     *
     * @returns true -- if the Widget was opened successfully
     */
    addWidget(opts: AddWidgetOpts): boolean {
        const dashboard = this.dashboard;

        if (dashboard.isLocked) {
            errorStore.notice("Dashboard Locked", "The current Dashboard is locked and Widgets may not be added.");
            return false;
        }
        const { widget, title } = getUserWidget(opts.widget);
        if (widget.isSingleton && dashboard.containsWidget(hasSameId(widget))) {
            errorStore.notice("Singleton Widget", `The Widget '${title}' is a Singleton and may not be added twice.`);
            return false;
        }

        const isSuccess = this.dashboard.addWidget(opts);

        if (isSuccess && widget.isBackground) {
            errorStore.info("Background Widget", `The Widget '${title}' has been added in the background.`);
        }

        return isSuccess;
    }

    async addWidgetSimple(
        widget: Widget,
        destDashboard?: Dashboard,
        path?: MosaicPath,
        positionInDash?: MosaicDropTargetPosition
    ): Promise<boolean> {
        const importingUser = (await authService.check()).data;
        const userWidgets: UserWidget[] = values(dashboardStore.userDashboards().value.widgets);
        let highestID: number = 0;
        for (const uWidget of userWidgets) {
            if (uWidget.id > highestID) {
                highestID = uWidget.id;
            }
        }
        const userWidget: UserWidget = new UserWidget({
            id: highestID + 1,
            isDisabled: false,
            isEditable: true,
            isFavorite: false,
            isGroupWidget: false,
            position: 0,
            title: widget.title,
            user: {
                username: importingUser.username,
                displayName: importingUser.userRealName
            },
            widget: widget
        });

        const widgetOpts = {
            widget: userWidget,
            title: widget.title,
            path: path,
            position: positionInDash
        };
        if (destDashboard) {
            return destDashboard.addWidget(widgetOpts);
        } else {
            return this.addWidget(widgetOpts);
        }
    }

    /**
     * Add a UserWidget by Widget ID to the current Dashboard
     *
     * @returns true -- if the Widget was opened successfully
     */
    addUserWidgetById(userWidgetId: number, path?: MosaicPath, position?: MosaicDropTargetPosition): boolean {
        const userWidget = dashboardStore.findUserWidgetById(userWidgetId);
        if (!userWidget) return false;

        return this.addWidget({ widget: userWidget, path, position });
    }

    closeWidgetById(instanceId: string): void {
        this.dashboard.closeWidget(instanceId);
    }

    setCollapsed(instanceId: string, isCollapsed: boolean): void {
        const panel = this.findPanelByWidgetInstanceId(instanceId);
        if (!panel || !isExpandoPanel(panel)) return;
        panel.setCollapsed(instanceId, isCollapsed);
    }

    setPanelTitle(panel: Panel, title: string): void {
        panel.setTitle(title);
    }

    /**
     * Find and launch a Widget (for the Widget Launcher API)
     *
     * @returns true -- if the Widget was launched successfully
     */
    launchWidget(args: WidgetLaunchArgs): boolean {
        const userWidget = this.findUserWidget(byGuidOrUniversalName(args.guid, args.universalName));
        if (!userWidget) return false;

        userWidget.launchData = args.data;

        return this.addWidget({ widget: userWidget, title: args.title });
    }

    moveWindowToMosaic(sourcePath: MosaicPath, targetPath: MosaicPath, position: MosaicDropTargetPosition): void {
        const layout = this.dashboardState.tree;
        if (!layout) return;

        const updates = createDragToUpdates(layout, sourcePath, targetPath, position);
        const newLayout = updateTree(layout, updates);

        this.setLayout(newLayout);
    }

    moveWindowToPanel(sourcePath: MosaicPath, targetPath: MosaicPath, onFailure?: () => void): void {
        const dashboard = this.dashboard;

        const sourcePanel = dashboard.getPanelByPath(sourcePath);
        const targetPanel = dashboard.getPanelByPath(targetPath);
        if (!sourcePanel || !targetPanel) return;

        const widgetInstances = sourcePanel.state().value.widgets;

        targetPanel.addWidgets(widgetInstances, {
            onSuccess: () => dashboard.removeNode(sourcePath),
            onFailure
        });
    }

    moveInstanceToMosaic(
        widgetInstanceId: string,
        path: MosaicPath | undefined,
        position: MosaicDropTargetPosition | undefined
    ): void {
        const panel = this.findPanelByWidgetInstanceId(widgetInstanceId);
        if (!panel) return;

        const instance = panel.closeWidget(widgetInstanceId);
        if (!instance) return;

        this.addWidget({ widget: instance, path, position });
    }

    moveInstanceToPanel(widgetInstanceId: string, targetPath: MosaicPath): void {
        const sourcePanel = this.findPanelByWidgetInstanceId(widgetInstanceId);
        if (!sourcePanel) return;

        const targetPanel = this.getPanelByPath(targetPath);
        if (!targetPanel) return;

        // Ignore drops when the instance is already in the target panel
        if (sourcePanel === targetPanel) return;

        const widgetInstance = sourcePanel.findWidget(widgetInstanceId);
        if (!widgetInstance) return;

        targetPanel.addWidgets(widgetInstance, {
            onSuccess: () => sourcePanel.closeWidget(widgetInstanceId)
        });
    }

    addLayout_TEMP = (layout: LayoutType) => {
        switch (layout) {
            case "fit":
                this.dashboard.addPanel(createSampleFitPanel());
                break;

            case "tabbed":
                this.dashboard.addPanel(createSampleTabbedPanel());
                break;

            case "accordion":
                this.dashboard.addPanel(createSampleAccordionPanel());
                break;

            case "portal":
                this.dashboard.addPanel(createSamplePortalPanel());
                break;
        }
    };

    private findUserWidget(predicate: Predicate<UserWidget>): UserWidget | undefined {
        const userState = this.store.userDashboards().value;
        const userWidgets = values(userState.widgets);

        return userWidgets.find(predicate);
    }
}

function getUserWidget(widget: UserWidget | WidgetInstance): UserWidget {
    return widget instanceof UserWidget ? widget : widget.userWidget;
}

function byGuidOrUniversalName(guid?: string, universalName?: string): Predicate<UserWidget> {
    return (userWidget: UserWidget) =>
        (!isNil(guid) && userWidget.widget.id === guid) ||
        (!isNil(universalName) && userWidget.widget.universalName === universalName);
}

function createSampleFitPanel(): FitPanel {
    return new FitPanel();
}

function createSampleTabbedPanel(): TabbedPanel {
    return new TabbedPanel({ title: "New Tabbed Panel" });
}

function createSampleAccordionPanel(): ExpandoPanel {
    return new ExpandoPanel("accordion", { title: "New Accordion Panel" });
}

function createSamplePortalPanel(): ExpandoPanel {
    return new ExpandoPanel("portal", { title: "New Portal Panel" });
}

// tslint:disable:no-bitwise
export function mosaicPathFromCode(code: number): MosaicBranch[] {
    // Places the panels in a sane way, making sure no panel is initially less than half the size of any other panel.
    // remember this is a KD tree, where the way to add a panel is to essentaily split an existing one in half.
    // Sorry that it's bitwise stuff.
    const firstBitMask = 1;
    const path: MosaicBranch[] = [];
    const pathDirections: MosaicBranch[] = ["first", "second"];

    while (code > 1) {
        const firstBit = code & firstBitMask; // going to be either 1 or 0
        path.push(pathDirections[firstBit]);
        code = code >> 1; // remove the smallest
    }
    return path;
}

export function mosaicPositionFromCode(code: number): MosaicDropTargetPosition {
    // remember this is a KD tree, where the way to add a panel is to essentaily split an existing one in half.
    // So the path goes around in a circle, splitting all nodes of one size before going around and splitting all nodes on the next level.
    // The direction of split thus has to alternate at each level.
    // I.e.:
    // 0 : center (first thing must go in center)
    // 1 : right
    // 2 - 3 : bottom
    // 4 - 7 : right
    // 8 - 15 : bottom
    // etc

    if (code === 0) {
        return MosaicDropTargetPosition.CENTER;
    }
    const whatLevelOfSplitAreWeOn = Math.floor(Math.log2(code)) + 1;
    return whatLevelOfSplitAreWeOn % 2 === 1 ? MosaicDropTargetPosition.RIGHT : MosaicDropTargetPosition.BOTTOM;
}

export const dashboardService = new DashboardService();
