import { MosaicNode } from "react-mosaic-component";

export interface WidgetDefinition {
    id: string;
    title: string;
    element: JSX.Element;
}

export interface Widget {
    id: string;
    definition: WidgetDefinition;
}

export type WidgetMap = { [id: string]: Widget };

export type DashboardNode = MosaicNode<string>;

export type LayoutType = "tile" | "fit";

export interface Dashboard {
    type: LayoutType;
    layout: DashboardNode | null;
    widgets: WidgetMap;
}
