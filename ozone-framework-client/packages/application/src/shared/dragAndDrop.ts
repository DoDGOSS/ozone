import { ConnectDragPreview, ConnectDragSource, DragSourceConnector, DragSourceMonitor } from "react-dnd";
import { defer } from "lodash";

import { MosaicDropData } from "../features/MosaicDashboard";

import { MOSAIC_CONTEXT_ID } from "../constants";

export interface DragSourceProps {
    connectDragSource: ConnectDragSource;
    connectDragPreview: ConnectDragPreview;
}

export interface WidgetDragItem {
    userWidgetId: number;
    deferTimerId?: number;
    mosaicId: string;
}

export interface InstanceDragItem {
    widgetInstanceId: string;
    deferTimerId?: number;
    mosaicId: string;
}

type EndDragSpec<P> = (props: P, monitor: DragSourceMonitor, component: any) => void;

type BeginDragSpec<T, P> = (props: P, monitor: DragSourceMonitor, component: any) => T;

export interface BeginWidgetDragEvent<P> {
    props: P;
    monitor: DragSourceMonitor;
    component: any;
    defer: (callback: () => void) => void;
}

export type BeginWidgetDragCallback<P> = (event: BeginWidgetDragEvent<P>) => number;

export type BeginInstanceDragCallback<P> = (event: BeginWidgetDragEvent<P>) => string;

export interface EndWidgetDragEvent<P> {
    userWidgetId: number;
    dropResult: MosaicDropData;
    props: P;
    monitor: DragSourceMonitor;
    component: any;
}

export interface EndInstanceDragEvent<P> {
    widgetInstanceId: string;
    dropResult: MosaicDropData;
    props: P;
    monitor: DragSourceMonitor;
    component: any;
}

export type EndWidgetDragCallback<P> = (event: EndWidgetDragEvent<P>) => void;

export type EndInstanceDragCallback<P> = (event: EndInstanceDragEvent<P>) => void;

export function beginWidgetDrag<P>(callback: BeginWidgetDragCallback<P>): BeginDragSpec<WidgetDragItem, P> {
    return (props: P, monitor: DragSourceMonitor, component: any) => {
        let deferTimerId: number | undefined = undefined;

        const userWidgetId = callback({
            props,
            monitor,
            component,
            defer: (callback: () => void) => {
                if (deferTimerId !== undefined) {
                    throw new Error("defer may only be called once");
                }
                deferTimerId = defer(callback);
            }
        });

        return {
            userWidgetId,
            deferTimerId,
            mosaicId: MOSAIC_CONTEXT_ID
        };
    };
}

export function endWidgetDrag<P>(callback: EndWidgetDragCallback<P>): EndDragSpec<P> {
    return (props: P, monitor: DragSourceMonitor, component: any) => {
        const item = monitor.getItem() as WidgetDragItem;
        const { userWidgetId, deferTimerId } = item;

        if (deferTimerId !== undefined) {
            window.clearTimeout(deferTimerId);
        }

        const dropResult = (monitor.getDropResult() || {}) as MosaicDropData;

        callback({
            userWidgetId,
            dropResult,
            props,
            monitor,
            component
        });
    };
}

export function beginInstanceDrag<P>(callback: BeginInstanceDragCallback<P>): BeginDragSpec<InstanceDragItem, P> {
    return (props: P, monitor: DragSourceMonitor, component: any) => {
        let deferTimerId: number | undefined = undefined;

        const widgetInstanceId = callback({
            props,
            monitor,
            component,
            defer: (callback: () => void) => {
                if (deferTimerId !== undefined) {
                    throw new Error("defer may only be called once");
                }
                deferTimerId = defer(callback);
            }
        });

        return {
            widgetInstanceId,
            deferTimerId,
            mosaicId: MOSAIC_CONTEXT_ID
        };
    };
}

export function endInstanceDrag<P>(callback: EndInstanceDragCallback<P>): EndDragSpec<P> {
    return (props: P, monitor: DragSourceMonitor, component: any) => {
        const item = monitor.getItem() as InstanceDragItem;
        const { widgetInstanceId, deferTimerId } = item;

        if (deferTimerId !== undefined) {
            window.clearTimeout(deferTimerId);
        }

        const dropResult = (monitor.getDropResult() || {}) as MosaicDropData;

        callback({
            widgetInstanceId,
            dropResult,
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
