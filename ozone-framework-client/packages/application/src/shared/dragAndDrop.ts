import {
    ConnectDragPreview,
    ConnectDragSource,
    DragSourceConnector,
    DragSourceMonitor,
    DropTargetMonitor
} from "react-dnd";
import { defer } from "lodash";

import { MOSAIC_CONTEXT_ID } from "../constants";
import { MosaicPath } from "../features/MosaicDashboard/types";

export const MosaicDragType = {
    WINDOW: "MosaicWindow"
};

export interface DragSourceProps {
    connectDragSource: ConnectDragSource;
    connectDragPreview: ConnectDragPreview;
}

export interface DragItem {
    dragData?: DragData;
    deferTimerId?: number;
    mosaicId?: string;
}

export type DragData = WindowDragData | WidgetDragData | InstanceDragData;

export const DragDataType = {
    WINDOW: "window",
    WIDGET: "widget",
    INSTANCE: "instance"
} as const;

export interface WindowDragData {
    type: "window";
    path: MosaicPath;
}

export interface WidgetDragData {
    type: "widget";
    userWidgetId: number;
}

export interface InstanceDragData {
    type: "instance";
    widgetInstanceId: string;
}

type EndDragSpec<P> = (props: P, monitor: DragSourceMonitor, component: any) => void;

type BeginDragSpec<T, P> = (props: P, monitor: DragSourceMonitor, component: any) => T;

export interface BeginDragEvent<P> {
    props: P;
    monitor: DragSourceMonitor;
    component: any;
    defer: (callback: () => void) => void;
}

export type BeginDragCallback<P> = (event: BeginDragEvent<P>) => DragData | undefined;

export type MosaicDropTargetPosition = "top" | "bottom" | "left" | "right" | "root" | "fill";
export const MosaicDropTargetPosition = {
    TOP: "top" as "top",
    BOTTOM: "bottom" as "bottom",
    LEFT: "left" as "left",
    RIGHT: "right" as "right"
};

export type DropData = MosaicDropData | TablistDropData;

export const DropDataType = {
    MOSAIC: "mosaic",
    TABLIST: "tablist"
} as const;

export interface MosaicDropData {
    type: "mosaic";
    position?: MosaicDropTargetPosition;
    path?: MosaicPath;
}

export interface TablistDropData {
    type: "tablist";
    index?: number;
    panelId?: string;
}

export interface MosaicDragItem {
    mosaicId: string;
    hideTimer: number;
}

export interface EndDragEvent<P> {
    dragData?: DragData;
    dropData: DropData;
    props: P;
    monitor: DragSourceMonitor;
    component: any;
}

export type EndDragCallback<P> = (event: EndDragEvent<P>) => void;

export function getDropItem(monitor: DropTargetMonitor): DragItem {
    return monitor.getItem() || {};
}

export function beginWidgetDrag<P>(callback: BeginDragCallback<P>): BeginDragSpec<DragItem, P> {
    return (props: P, monitor: DragSourceMonitor, component: any): DragItem => {
        let deferTimerId: number | undefined;

        const data = callback({
            props,
            monitor,
            component,
            defer: (deferredCallback: () => void) => {
                if (deferTimerId !== undefined) {
                    throw new Error("defer may only be called once");
                }
                deferTimerId = defer(deferredCallback);
            }
        });

        return {
            dragData: data,
            deferTimerId,
            mosaicId: MOSAIC_CONTEXT_ID
        };
    };
}

export function endWidgetDrag<P>(callback: EndDragCallback<P>): EndDragSpec<P> {
    return (props: P, monitor: DragSourceMonitor, component: any): void => {
        const item = monitor.getItem() as DragItem;
        const { dragData, deferTimerId } = item;

        if (deferTimerId !== undefined) {
            window.clearTimeout(deferTimerId);
        }

        const dropData = (monitor.getDropResult() || {}) as DropData;

        callback({
            dragData,
            dropData,
            props,
            monitor,
            component
        });
    };
}

export function collectDragProps(connect: DragSourceConnector): DragSourceProps {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview()
    };
}
