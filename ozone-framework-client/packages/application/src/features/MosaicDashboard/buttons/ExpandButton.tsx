import React from "react";
import classNames from "classnames";

import { MosaicWindowContext } from "../contextTypes";
import { MosaicKey } from "../types";
import { getBlueprintIconClass } from "../util/blueprint";
import { createDefaultToolbarButton, MosaicButtonProps } from "./MosaicButton";

export class ExpandButton<T extends MosaicKey> extends React.PureComponent<MosaicButtonProps> {
    static contextTypes = MosaicWindowContext;
    context!: MosaicWindowContext<T>;

    render() {
        return createDefaultToolbarButton(
            "Expand",
            classNames("expand-button", getBlueprintIconClass("MAXIMIZE")),
            this.expand
        );
    }

    private expand = () => {
        this.context.mosaicActions.expand(this.context.mosaicWindowActions.getPath());

        if (this.props.onClick) {
            this.props.onClick();
        }
    };
}

export const ExpandButtonFactory = React.createFactory(ExpandButton);
