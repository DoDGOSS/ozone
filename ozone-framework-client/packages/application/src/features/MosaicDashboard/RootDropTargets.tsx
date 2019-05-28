import React from "react";
import { DropTarget } from "react-dnd";
import classNames from "classnames";
import { values } from "lodash";

import { MosaicDropTarget } from "./MosaicDropTarget";
import { MosaicDragType, MosaicDropTargetPosition } from "../../shared/dragAndDrop";

export interface RootDropTargetsProps {
    isDragging: boolean;
}

class RootDropTargetsClass extends React.PureComponent<RootDropTargetsProps> {
    render() {
        return (
            <div
                className={classNames("drop-target-container", {
                    "-dragging": this.props.isDragging
                })}
            >
                {values<MosaicDropTargetPosition>(MosaicDropTargetPosition).map((position) => (
                    <MosaicDropTarget position={position} path={[]} key={position} />
                ))}
            </div>
        );
    }
}

const dropTarget = {};
export const RootDropTargets = DropTarget(
    MosaicDragType.WINDOW,
    dropTarget,
    (_connect, monitor): RootDropTargetsProps => ({
        isDragging: monitor.getItem() !== null && monitor.getItemType() === MosaicDragType.WINDOW
    })
)(RootDropTargetsClass as any) as React.ComponentType<{}>;
