import { MosaicPath } from "./types";
import { DropTargetMonitor } from "react-dnd";

export type MosaicDropTargetPosition = "top" | "bottom" | "left" | "right" | "root";
export const MosaicDropTargetPosition = {
    TOP: "top" as "top",
    BOTTOM: "bottom" as "bottom",
    LEFT: "left" as "left",
    RIGHT: "right" as "right"
};

export interface MosaicDropData {
    path?: MosaicPath;
    position?: MosaicDropTargetPosition;
}

export interface MosaicDragItem {
    mosaicId: string;
    hideTimer: number;
}

interface HasMosaicContextId {
    context: {
        mosaicId: string;
    };
}

export function getDropItem(monitor: DropTargetMonitor): MosaicDragItem {
    return monitor.getItem() || {};
}

export function isWithinMosaicContext(mosaicComponent: HasMosaicContextId, monitor: DropTargetMonitor): boolean {
    return mosaicComponent.context.mosaicId === getDropItem(monitor).mosaicId;
}
