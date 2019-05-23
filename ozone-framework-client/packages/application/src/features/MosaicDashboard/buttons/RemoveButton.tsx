import React from "react";
import classNames from "classnames";

import { MosaicWindowContext } from "../contextTypes";
import { MosaicKey } from "../types";
import { getBlueprintIconClass } from "../util/blueprint";
import { createDefaultToolbarButton, MosaicButtonProps } from "./MosaicButton";

export class RemoveButton<T extends MosaicKey> extends React.PureComponent<MosaicButtonProps> {
    static contextTypes = MosaicWindowContext;
    context!: MosaicWindowContext<T>;

    render() {
        return createDefaultToolbarButton(
            "Close Window",
            classNames("close-button", getBlueprintIconClass("CROSS")),
            this.remove
        );
    }

    private remove = () => {
        this.context.mosaicActions.remove(this.context.mosaicWindowActions.getPath());
        if (this.props.onClick) {
            this.props.onClick();
        }
    };
}

export const RemoveButtonFactory = React.createFactory(RemoveButton);
