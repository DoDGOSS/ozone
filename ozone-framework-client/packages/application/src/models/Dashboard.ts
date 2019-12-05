import { dropRight, isString, omit, pick, set } from "lodash";

import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { ProfileReference } from "../api/models/UserDTO";
import { DashboardNode, DashboardPath } from "../components/widget-dashboard/types";
import { MosaicDirection, MosaicNode, MosaicParent, MosaicPath } from "../features/MosaicDashboard/types";
import { createRemoveUpdate, updateTree } from "../features/MosaicDashboard/util/mosaicUpdates";
import {
    Corner,
    getAndAssertNodeAtPathExists,
    getNodeAtPath,
    getOtherDirection,
    getPathToCorner
} from "../features/MosaicDashboard/util/mosaicUtilities";
import { MosaicDropTargetPosition } from "../shared/dragAndDrop";
import { byId, flatMap, omitIndex, Predicate, some, values } from "../utility";

import { ExpandoPanel, FitPanel, LayoutType, Panel, PanelState, TabbedPanel } from "./panel";
import { UserWidget } from "./UserWidget";
import { Widget } from "./Widget";
import { getInstanceWidgetsOf, getWidgetOf, WidgetInstance } from "./WidgetInstance";

export interface DashboardLayout {
    tree: DashboardNode | null;
    panels: Dictionary<Panel>;
    backgroundWidgets: WidgetInstance[];
}

export interface DashboardProps extends DashboardLayout {
    id?: number;
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
    widget: UserWidget | WidgetInstance;
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

    get isLocked() {
        return this.state$.value.isLocked;
    }

    get name() {
        return this.state$.value.name;
    }

    get description() {
        return this.state$.value.description;
    }

    state = () => asBehavior(this.state$);

    /**
     * Find a Widget instance in any of the Dashboard Panels
     */
    findWidget(instanceId: string): WidgetInstance | undefined {
        const { backgroundWidgets, panels } = this.state$.value;

        for (const bg of backgroundWidgets) {
            if (bg.id === instanceId) return bg;
        }

        for (const panel of values(panels)) {
            const widget = panel.findWidget(instanceId);
            if (widget !== undefined) return widget;
        }

        return undefined;
    }

    findPanelByWidgetInstanceId(instanceId: string): Panel | null {
        const { panels } = this.state$.value;

        for (const panel of values(panels)) {
            if (panel.findWidget(instanceId)) return panel;
        }

        return null;
    }

    getWidgets(): WidgetInstance[] {
        const { backgroundWidgets, panels } = this.state$.value;

        const panelWidgets = flatMap(panels, (panel) => panel.state().value.widgets);

        return [...panelWidgets, ...backgroundWidgets];
    }

    containsWidget(predicate: Predicate<Widget>): boolean {
        const { backgroundWidgets, panels } = this.state$.value;

        if (some(getInstanceWidgetsOf(backgroundWidgets), predicate)) return true;

        for (const panel of values(panels)) {
            if (some(getInstanceWidgetsOf(panel.state().value.widgets), predicate)) return true;
        }

        return false;
    }

    lock = (): void => {
        const prev = this.state$.value;
        this.state$.next({ ...prev, isLocked: true });
    };

    unlock = (): void => {
        const prev = this.state$.value;
        this.state$.next({ ...prev, isLocked: false });
    };

    setAsDefault = (isDefault: boolean): void => {
        const prev = this.state$.value;
        this.state$.next({ ...prev, isDefault });
    };

    addWidget(opts: AddWidgetOpts): boolean {
        const { widget, title, path, position } = opts;

        const instance = widget instanceof UserWidget ? WidgetInstance.create(widget) : widget;

        const prev = this.state$.value;
        const { panels, tree } = prev;

        // Background widget?
        if (getWidgetOf(instance).isBackground) {
            this.state$.next({
                ...prev,
                backgroundWidgets: [...prev.backgroundWidgets, instance]
            });
            return true;
        }

        // Add to panel?
        if (tree !== null && path !== undefined && position === "center") {
            const targetPanel = this.getPanelByPath(path);
            if (targetPanel) {
                targetPanel.addWidgets(instance);
                return true;
            }
        }

        // Add to mosaic
        const panel = new FitPanel({ title, widget: instance });

        let newTree: DashboardNode;
        if (!tree) {
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
    }

    closeWidget(instanceId: string): void {
        const prev = this.state$.value;
        const { backgroundWidgets } = prev;

        const idx = backgroundWidgets.map(byId).indexOf(instanceId);
        if (idx >= 0) {
            this.state$.next({
                ...prev,
                backgroundWidgets: omitIndex(backgroundWidgets, idx)
            });
            return;
        }

        const panel = this.findPanelByWidgetInstanceId(instanceId);
        if (panel) {
            panel.closeWidget(instanceId);
        }
    }

    addPanel(panel: Panel<PanelState>, path?: MosaicPath, position?: MosaicDropTargetPosition) {
        const prev = this.state$.value;
        const { panels, tree } = prev;

        let newTree;
        if (tree !== null) {
            if (path !== undefined && position !== undefined) {
                newTree = addToLayout(tree, panel.id, path, position);
            } else {
                newTree = addToTopRightOfLayout(tree, panel.id);
            }
        } else {
            newTree = panel.id;
        }

        this.state$.next({
            ...prev,
            tree: newTree,
            panels: {
                ...panels,
                [panel.id]: panel
            }
        });
    }

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

    getPanelByPath(path: MosaicPath): Panel | null {
        const { tree, panels } = this.state$.value;
        if (tree === null) return null;

        const node = getNodeAtPath(tree, path);
        if (node === null) return null;

        if (typeof node !== "string") return null;

        const panel = panels[node];
        if (!panel) return null;

        return panel;
    }

    removeNode(path: MosaicPath): void {
        const { tree } = this.state$.value;
        if (tree === null) return;

        const removeUpdate = createRemoveUpdate(tree, path);
        const newTree = updateTree(tree, [removeUpdate]);

        this.setLayout(newTree);
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

    setPanelLayout(panel: Panel<PanelState>, path: DashboardPath, layout: LayoutType) {
        const prev = this.state$.value;
        const { tree, panels } = prev;

        if (!tree) throw new Error("setPanelLayout: no current Dashboard tree");

        const { title, widgets } = panel.state().value;
        let newPanel: Panel<PanelState> | undefined;
        if (layout === "fit") {
            const widget = widgets.length > 0 ? widgets[0] : undefined;
            newPanel = new FitPanel({ title, widget });
        } else if (layout === "tabbed") {
            newPanel = new TabbedPanel({ title, widgets });
        } else if (layout === "accordion") {
            newPanel = new ExpandoPanel("accordion", { title, widgets });
        } else if (layout === "portal") {
            newPanel = new ExpandoPanel("portal", { title, widgets });
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
    }
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
    backgroundWidgets: [],
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
    tree: "",
    user: {
        username: ""
    }
});
