import {
    ConnectDragPreview,
    ConnectDragSource,
    ConnectDropTarget,
    DragSourceConnector,
    DragSourceMonitor,
    DropTargetConnector,
    DropTargetMonitor
} from "react-dnd";
import { defer } from "lodash";
import { BehaviorSubject } from "rxjs";

import { MosaicPath } from "../features/MosaicDashboard/types";
import { asBehavior } from "../observables";
import { Boxed, boxed } from "../utility";

const _isDragging$ = new BehaviorSubject(false);
export const isDragging$ = () => asBehavior(_isDragging$);

export const MosaicDragType = {
    WINDOW: "MosaicWindow"
};

export interface DragSourceProps {
    connectDragSource: ConnectDragSource;
    connectDragPreview: ConnectDragPreview;
}

export interface DragItem {
    dragData?: DragData;
    deferTimerId: Boxed<number | undefined>;
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

export type MosaicDropTargetPosition = "top" | "bottom" | "left" | "right" | "center";
export const MosaicDropTargetPosition = {
    TOP: "top" as "top",
    BOTTOM: "bottom" as "bottom",
    LEFT: "left" as "left",
    RIGHT: "right" as "right",
    CENTER: "center" as "center"
};

export const DropDataType = {
    MOSAIC: "mosaic"
} as const;

export interface DropData {
    type: "mosaic";
    position?: MosaicDropTargetPosition;
    path?: MosaicPath;
}

export interface EndDragEvent<P> {
    dragData?: DragData;
    dropData: DropData;
    props: P;
    monitor: DragSourceMonitor;
    component: any;
}

export type EndDragCallback<P> = (event: EndDragEvent<P>) => void;

let saveSnapshot: () => void | undefined;

export function setSaveSnapshotCallback(callback: () => void): void {
    saveSnapshot = callback;
}

export function beginWidgetDrag<P>(callback: BeginDragCallback<P>): BeginDragSpec<DragItem, P> {
    return (props: P, monitor: DragSourceMonitor, component: any): DragItem => {
        const deferTimerId = boxed<number>();

        if (saveSnapshot) saveSnapshot();

        const data = callback({
            props,
            monitor,
            component,
            defer: (deferredCallback: () => void) => {
                if (deferTimerId.value !== undefined) {
                    throw new Error("defer may only be called once");
                }
                deferTimerId.value = defer(deferredCallback);
            }
        });

        _isDragging$.next(true);

        return {
            dragData: data,
            deferTimerId
        };
    };
}

export function endWidgetDrag<P>(callback: EndDragCallback<P>): EndDragSpec<P> {
    return (props: P, monitor: DragSourceMonitor, component: any): void => {
        const item = monitor.getItem() as DragItem;
        const { dragData, deferTimerId } = item;

        if (deferTimerId.value !== undefined) {
            window.clearTimeout(deferTimerId.value);
        }

        _isDragging$.next(false);

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

export interface DropTargetProps {
    connectDropTarget: ConnectDropTarget;
    isOver: boolean;
    isOverShallow: boolean;
}

export function collectDropProps(connect: DropTargetConnector, monitor: DropTargetMonitor): DropTargetProps {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverShallow: monitor.isOver({ shallow: true })
    };
}

export function collectDragProps(connect: DragSourceConnector): DragSourceProps {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview()
    };
}
