import React from "react";
import classNames from "classnames";
import { noop } from "lodash";

import { MosaicWindowContext } from "../contextTypes";
import { MosaicKey } from "../types";
import { getBlueprintIconClass } from "../util/blueprint";
import { createDefaultToolbarButton, MosaicButtonProps } from "./MosaicButton";

export class SplitButton<T extends MosaicKey> extends React.PureComponent<MosaicButtonProps> {
    static contextTypes = MosaicWindowContext;
    context!: MosaicWindowContext<T>;

    render() {
        return createDefaultToolbarButton(
            "Split Window",
            classNames("split-button", getBlueprintIconClass("ADD_COLUMN_RIGHT")),
            this.split
        );
    }

    private split = () => {
        this.context.mosaicWindowActions
            .split()
            .then(() => {
                if (this.props.onClick) {
                    this.props.onClick();
                }
            })
            .catch(noop); // Swallow rejections (i.e. on user cancel)
    };
}

export const SplitButtonFactory = React.createFactory(SplitButton);
