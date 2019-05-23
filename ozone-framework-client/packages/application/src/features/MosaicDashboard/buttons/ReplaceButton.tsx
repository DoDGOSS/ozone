import React from "react";
import classNames from "classnames";
import { noop } from "lodash";

import { MosaicWindowContext } from "../contextTypes";
import { MosaicKey } from "../types";
import { getBlueprintIconClass } from "../util/blueprint";
import { createDefaultToolbarButton, MosaicButtonProps } from "./MosaicButton";

export class ReplaceButton<T extends MosaicKey> extends React.PureComponent<MosaicButtonProps> {
    static contextTypes = MosaicWindowContext;
    context!: MosaicWindowContext<T>;

    render() {
        return createDefaultToolbarButton(
            "Replace Window",
            classNames("replace-button", getBlueprintIconClass("EXCHANGE")),
            this.replace
        );
    }

    private replace = () => {
        this.context.mosaicWindowActions
            .replaceWithNew()
            .then(() => {
                if (this.props.onClick) {
                    this.props.onClick();
                }
            })
            .catch(noop); // Swallow rejections (i.e. on user cancel)
    };
}

export const ReplaceButtonFactory = React.createFactory(ReplaceButton);
