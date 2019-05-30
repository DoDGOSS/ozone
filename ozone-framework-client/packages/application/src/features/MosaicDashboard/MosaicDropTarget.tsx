import React from "react";
import { DropTarget } from "react-dnd";
import classNames from "classnames";

import {
    collectDropProps,
    DropData,
    DropTargetProps,
    MosaicDragType,
    MosaicDropTargetPosition
} from "../../shared/dragAndDrop";

import { MosaicPath } from "./types";

export interface MosaicDropTargetProps {
    position: MosaicDropTargetPosition;
    path?: MosaicPath;
}

type MosaicDropTargetDndProps = MosaicDropTargetProps & DropTargetProps;

class MosaicDropTargetClass extends React.PureComponent<MosaicDropTargetDndProps> {
    render() {
        const { connectDropTarget, isOver, position } = this.props;

        return connectDropTarget(
            <div className={classNames("drop-target", position, { "drop-target-hover": isOver })} />
        );
    }
}

const dropSpec = {
    drop: (props: MosaicDropTargetDndProps): DropData => ({
        type: "mosaic",
        path: props.path,
        position: props.position
    })
};

export const MosaicDropTarget = DropTarget(MosaicDragType.WINDOW, dropSpec, collectDropProps)(
    MosaicDropTargetClass
) as React.ComponentType<MosaicDropTargetProps>;
