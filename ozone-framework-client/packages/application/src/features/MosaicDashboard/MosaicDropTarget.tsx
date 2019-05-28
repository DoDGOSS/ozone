import React from "react";
import { ConnectDropTarget, DropTarget, DropTargetMonitor } from "react-dnd";
import classNames from "classnames";

import { MosaicContext } from "./contextTypes";
import { MosaicPath } from "./types";

import { getDropItem, MosaicDragType, MosaicDropData, MosaicDropTargetPosition } from "../../shared/dragAndDrop";

export interface MosaicDropTargetProps {
    position: MosaicDropTargetPosition;
    path: MosaicPath;
}

interface DropTargetProps {
    connectDropTarget: ConnectDropTarget;
    isOver: boolean;
    draggedMosaicId: string | undefined;
}

type Props = MosaicDropTargetProps & DropTargetProps;

class MosaicDropTargetClass extends React.PureComponent<Props> {
    static contextTypes = MosaicContext;
    context!: MosaicContext<any>;

    render() {
        const { position, isOver, connectDropTarget, draggedMosaicId } = this.props;
        return connectDropTarget(
            <div
                className={classNames("drop-target", position, {
                    "drop-target-hover": isOver && draggedMosaicId === this.context.mosaicId
                })}
            />
        );
    }
}

const dropTarget = {
    drop: (props: Props, monitor: DropTargetMonitor, component: MosaicDropTargetClass): MosaicDropData => {
        if (component.context.mosaicId === getDropItem(monitor).mosaicId) {
            return {
                type: "mosaic",
                path: props.path,
                position: props.position
            };
        } else {
            return {
                type: "mosaic"
            };
        }
    }
};

export const MosaicDropTarget = (DropTarget(
    MosaicDragType.WINDOW,
    dropTarget,
    (connect, monitor): DropTargetProps => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        draggedMosaicId: getDropItem(monitor).mosaicId
    })
)(MosaicDropTargetClass) as any) as React.ComponentType<MosaicDropTargetProps>;
