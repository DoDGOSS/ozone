/* tslint:disable:member-ordering */

import React from "react";
import { ConnectDropTarget, DropTarget } from "react-dnd";
import classNames from "classnames";
import { noop } from "lodash";

import { Icon } from "@blueprintjs/core";

import { MosaicContext } from "./contextTypes";
import { CreateNode, MosaicKey } from "./types";
import { MosaicDropTarget } from "./MosaicDropTarget";
import { getBlueprintClasses, getBlueprintIconClass } from "./util/blueprint";

import { getDropItem, MosaicDragType } from "../../shared/dragAndDrop";

export interface MosaicZeroStateProps<T extends MosaicKey> {
    createNode?: CreateNode<T>;
}

interface MosaicZeroStateDropProps {
    connectDropTarget: ConnectDropTarget;
    isDragging: boolean;
    isOver: boolean;
    draggedMosaicId?: string;
}

type Props<T extends MosaicKey> = MosaicZeroStateProps<T> & MosaicZeroStateDropProps;

export class MosaicZeroStateBase<T extends MosaicKey> extends React.PureComponent<Props<T>> {
    context!: MosaicContext<T>;

    static contextTypes = MosaicContext;

    render() {
        const { connectDropTarget, isOver, isDragging, draggedMosaicId } = this.props;

        return connectDropTarget(
            <div
                className={classNames("mosaic-zero-state", getBlueprintClasses("NON_IDEAL_STATE"), {
                    "drop-target-hover": isOver && draggedMosaicId === this.context.mosaicId
                })}
            >
                <div className={getBlueprintClasses("NON_IDEAL_STATE_VISUAL")}>
                    <Icon iconSize={120} icon="applications" />
                </div>
                <h4 className={getBlueprintClasses("HEADING")}>No Windows Present</h4>
                <div>
                    {this.props.createNode && (
                        <button
                            className={classNames(getBlueprintClasses("BUTTON"), getBlueprintIconClass("ADD"))}
                            onClick={this.replace}
                        >
                            Add New Window
                        </button>
                    )}
                </div>
                <div className={classNames("drop-target-container", { "-dragging": isDragging })}>
                    <MosaicDropTarget position="root" path={[]} />
                </div>
            </div>
        );
    }

    private replace = () =>
        Promise.resolve(this.props.createNode!())
            .then((node) => this.context.mosaicActions.replaceWith([], node))
            .catch(noop); // Swallow rejections (i.e. on user cancel)
}

export const MosaicZeroState = DropTarget(
    MosaicDragType.WINDOW,
    {},
    (connect, monitor): MosaicZeroStateDropProps => ({
        connectDropTarget: connect.dropTarget(),
        isDragging: monitor.getItem() !== null && monitor.getItemType() === MosaicDragType.WINDOW,
        isOver: monitor.isOver(),
        draggedMosaicId: getDropItem(monitor).mosaicId
    })
)(MosaicZeroStateBase);
