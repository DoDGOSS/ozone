import { dropRight, isString, omit, pick, set } from "lodash";

import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../../observables";

import {
    Corner,
    getNodeAtPath,
    getOtherDirection,
    getPathToCorner,
    MosaicDirection,
    MosaicNode,
    MosaicParent,
    updateTree
} from "react-mosaic-component";

import { UserWidget } from "../UserWidget";

import { DashboardNode, DashboardPath, PanelMap } from "../../components/widget-dashboard/types";
import { LayoutType, Panel, PanelState } from "./types";

import { ExpandoPanel } from "./ExpandoPanel";
import { TabbedPanel } from "./TabbedPanel";
import { FitPanel } from "./FitPanel";
import { ProfileReference } from "../../api/models/UserDTO";
import { PropertiesOf } from "../../types";

export interface DashboardProps {
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
    panels: PanelMap;
    position: number;
    stackId: number;
    tree: DashboardNode | null;
    user: {
        username: string;
    };
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

    addWidget = (widget: UserWidget) => {
        const existingWidget = this.findWidgetById(widget.widget.id);
        if (existingWidget) return;

        const prev = this.state$.value;
        const { panels, tree } = prev;

        const panel = new FitPanel(null, null, widget);

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

    setLayout = (tree: DashboardNode | null) => {
        const prev = this.state$.value;
        const { panels } = prev;

        const panelIds = findPanelIds(tree);
        const newPanels = pick(panels, panelIds);

        this.state$.next({
            ...prev,
            tree,
            panels: newPanels
        });
    };

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
