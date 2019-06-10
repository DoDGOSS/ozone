import React from "react";
import { DropTarget, DropTargetMonitor } from "react-dnd";
import classNames from "classnames";

import { collectDropProps, DropData, DropTargetProps, MosaicDragType } from "../../shared/dragAndDrop";

import { MosaicPath } from "./types";
import { MosaicDropTarget } from "./MosaicDropTarget";

export interface DropTargetContainerProps {
    className?: string;
    forwardRef?: React.Ref<HTMLDivElement>;
    path?: MosaicPath;
    dropTargets?: React.ReactNode;
}

type DropTargetContainerDndProps = DropTargetContainerProps & DropTargetProps;

class DropTargetContainerBase extends React.PureComponent<DropTargetContainerDndProps> {
    render() {
        const {
            children,
            className,
            connectDropTarget,
            dropTargets,
            forwardRef,
            isOver,
            isOverShallow,
            path
        } = this.props;

        const classes = classNames("mosaic-drop-target", className, { "drop-target-hover": isOver });
        const containerClasses = classNames("drop-target-container", { "-hover-self": isOverShallow });

        return connectDropTarget(
            <div className={classes} ref={forwardRef ? forwardRef : null}>
                {children}
                <div className={containerClasses}>
                    {dropTargets ? (
                        dropTargets
                    ) : (
                        <>
                            <MosaicDropTarget path={path} position="top" />
                            <MosaicDropTarget path={path} position="bottom" />
                            <MosaicDropTarget path={path} position="left" />
                            <MosaicDropTarget path={path} position="right" />
                        </>
                    )}
                </div>
            </div>
        );
    }
}

const dropSpec = {
    drop: (props: DropTargetContainerDndProps, monitor: DropTargetMonitor): DropData | undefined => {
        if (!monitor.isOver({ shallow: true })) return;

        return {
            type: "mosaic",
            path: props.path ? props.path.slice() : undefined,
            position: "center"
        };
    }
};

export const DropTargetContainer = DropTarget(MosaicDragType.WINDOW, dropSpec, collectDropProps)(
    DropTargetContainerBase
);
