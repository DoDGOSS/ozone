/* tslint:disable:member-ordering */

import React from "react";
import classNames from "classnames";

import { Icon } from "@blueprintjs/core";

import { MosaicKey } from "./types";
import { DropTargetContainer } from "./DropTargetContainer";
import { MosaicDropTarget } from "./MosaicDropTarget";
import { getBlueprintClasses } from "./util/blueprint";

export class MosaicZeroState<T extends MosaicKey> extends React.PureComponent {
    render() {
        return (
            <DropTargetContainer
                className={classNames("mosaic-zero-state", getBlueprintClasses("NON_IDEAL_STATE"))}
                dropTargets={<MosaicDropTarget position="center" path={[]} />}
            >
                <div className={getBlueprintClasses("NON_IDEAL_STATE_VISUAL")}>
                    <Icon iconSize={120} icon="applications" />
                </div>
                <h4 className={getBlueprintClasses("HEADING")}>No Windows Present</h4>
            </DropTargetContainer>
        );
    }
}
