import { dropRight, isString, omit, pick, set } from "lodash";

import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../../observables";

import {
    Corner,
    getAndAssertNodeAtPathExists,
    getNodeAtPath,
    getOtherDirection,
    getPathToCorner,
    MosaicDirection,
    MosaicDropTargetPosition,
    MosaicNode,
    MosaicParent,
    MosaicPath,
    updateTree
} from "../../features/MosaicDashboard";

import { UserWidget } from "../UserWidget";

import { DashboardNode, DashboardPath } from "../../components/widget-dashboard/types";
import { LayoutType, Panel, PanelState } from "./types";

import { ExpandoPanel } from "./ExpandoPanel";
import { TabbedPanel } from "./TabbedPanel";
import { FitPanel } from "./FitPanel";
import { ProfileReference } from "../../api/models/UserDTO";
import { orNull } from "../../utility";

export interface DashboardLayout {
    tree: DashboardNode | null;
    panels: Dictionary<Panel<any>>;
}

export interface DashboardProps extends DashboardLayout {
    description?: string;
    guid: string;
    imageUrl?: string;
    isAlteredByAdmin: boolean;
    isDefault: boolean;
    isGroupDashboard: boolean;
    isLocked: boolean;
    isMarkedForDeletion: boolean;
    isPublishedToStore: boolean;
    metadata?: {
        createdBy: ProfileReference;
        createdDate: string;
        editedDate: string;
    };
    name: string;
    position: number;
    stackId: number;
    user: {
        username: string;
    };
}

export interface AddWidgetOpts {
    userWidget: UserWidget;
    title?: string;
    path?: MosaicPath;
    position?: MosaicDropTargetPosition;
}

export class Dashboard {
    private readonly state$: BehaviorSubject<DashboardProps>;

    constructor(props: PropertiesOf<DashboardProps>) {
        this.state$ = new BehaviorSubject(props);
    }

    get guid() {
        return this.state$.value.guid;
    }

    state = () => asBehavior(this.state$);

    findWidgetById = (widgetId: string): UserWidget | undefined => {
        const { panels } = this.state$.value;

        for (const panelId in panels) {
            if (panels.hasOwnProperty(panelId)) {
                const panel: Panel<any> = panels[panelId];
                const widget = panel.findWidgetById(widgetId);
                if (widget !== undefined) {
                    return widget;
                }
            }
        }

        return undefined;
    };

    addWidget = (opts: AddWidgetOpts): boolean => {
        const { userWidget, title, path, position } = opts;

        const existingWidget = this.findWidgetById(userWidget.widget.id);
        if (existingWidget) return false;

        const prev = this.state$.value;
        const { panels, tree } = prev;

        const panel = new FitPanel(null, orNull(title), userWidget);

        let newTree: DashboardNode;
        if (tree === null) {
            newTree = panel.id;
        } else if (path !== undefined && position !== undefined) {
            newTree = addToLayout(tree, panel.id, path, position);
        } else {
            newTree = addToTopRightOfLayout(tree, panel.id);
        }

        this.state$.next({
            ...prev,
            tree: newTree,
            panels: {
                ...panels,
                [panel.id]: panel
            }
        });

        return true;
    };

    addPanel = (panel: Panel<PanelState>) => {
        const prev = this.state$.value;
        const { panels, tree } = prev;

        const newTree = tree !== null ? addToTopRightOfLayout(tree, panel.id) : panel.id;

        this.state$.next({
            ...prev,
            tree: newTree,
            panels: {
                ...panels,
                [panel.id]: panel
            }
        });
    };

    /**
     * Set the new dashboard layout and check for changes to open/closed panels.
     */
    setLayout(tree: DashboardNode | null): void {
        const state = this.state$;
        const prev = state.value;

        const panelIds = findPanelIds(tree);
        const newPanels = pick(prev.panels, panelIds);

        state.next({
            ...prev,
            tree,
            panels: newPanels
        });
    }

    /**
     * Set the new dashboard layout without checking for changes to the panels.
     */
    setLayoutFast(tree: DashboardNode | null): void {
        const state = this.state$;
        state.next({
            ...state.value,
            tree
        });
    }

    setPanelLayout = (panel: Panel<PanelState>, path: DashboardPath, layout: LayoutType) => {
        const prev = this.state$.value;
        const { tree, panels } = prev;

        if (!tree) throw new Error("setPanelLayout: no current Dashboard tree");

        const { widgets } = panel.state().value;
        let newPanel: Panel<PanelState> | undefined;
        if (layout === "fit") {
            const newWidget = widgets.length > 0 ? widgets[0] : null;
            newPanel = new FitPanel(null, null, newWidget);
        } else if (layout === "tabbed") {
            newPanel = new TabbedPanel(null, "", widgets);
        } else if (layout === "accordion") {
            newPanel = new ExpandoPanel("accordion", null, "", widgets);
        } else if (layout === "portal") {
            newPanel = new ExpandoPanel("portal", null, "", widgets);
        }

        if (newPanel !== undefined) {
            const newTree = updateTree(tree, [{ path, spec: { $set: newPanel.id } }]);
            const newPanels = set(omit(panels, panel.id), newPanel.id, newPanel);

            this.state$.next({
                ...prev,
                tree: newTree,
                panels: newPanels
            });
        }
    };
}

function findPanelIds(node: DashboardNode | null): string[] {
    if (node === null) return [];
    if (isString(node)) return [node];
    return [...findPanelIds(node.first), ...findPanelIds(node.second)];
}

function addToLayout(
    layout: DashboardNode,
    id: string,
    targetPath: MosaicPath,
    position: MosaicDropTargetPosition
): DashboardNode {
    const targetNode = getAndAssertNodeAtPathExists(layout, targetPath);

    const newNode = id;

    let first: DashboardNode;
    let second: DashboardNode;

    if (position === MosaicDropTargetPosition.LEFT || position === MosaicDropTargetPosition.TOP) {
        first = newNode;
        second = targetNode;
    } else {
        first = targetNode;
        second = newNode;
    }

    let direction: MosaicDirection = "column";
    if (position === MosaicDropTargetPosition.LEFT || position === MosaicDropTargetPosition.RIGHT) {
        direction = "row";
    }

    const update = {
        path: targetPath,
        spec: {
            $set: { first, second, direction }
        }
    };

    return updateTree(layout, [update]);
}

function addToTopRightOfLayout(layout: DashboardNode, id: string): DashboardNode {
    const path = getPathToCorner(layout, Corner.TOP_RIGHT);
    const parent = getNodeAtPath(layout, dropRight(path)) as MosaicParent<string>;
    const destination = getNodeAtPath(layout, path) as MosaicNode<string>;
    const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : "row";
    let first: MosaicNode<string>;
    let second: MosaicNode<string>;
    if (direction === "row") {
        first = destination;
        second = id;
    } else {
        first = id;
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

    return updateTree(layout, [update]);
}

export const EMPTY_DASHBOARD = new Dashboard({
    guid: "",
    isAlteredByAdmin: false,
    isDefault: true,
    isGroupDashboard: false,
    isLocked: false,
    isMarkedForDeletion: false,
    isPublishedToStore: false,
    name: "",
    panels: {},
    position: 0,
    stackId: 0,
    tree: null,
    user: {
        username: ""
    }
});
