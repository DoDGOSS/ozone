import React from "react";

import { MosaicWindowContext } from "../contextTypes";
import { MosaicKey } from "../types";
import { MosaicButtonProps } from "./MosaicButton";
import { Button } from "@blueprintjs/core";

export class RemoveButton<T extends MosaicKey> extends React.PureComponent<MosaicButtonProps> {
    static contextTypes = MosaicWindowContext;
    context!: MosaicWindowContext<T>;

    render() {
        return (
            <Button
                minimal
                className="mosaic-default-control close-button"
                title={"Close Window"}
                icon="cross"
                onClick={this.remove}
            />
        );
    }

    private remove = () => {
        this.context.mosaicActions.remove(this.context.mosaicWindowActions.getPath());
        if (this.props.onClick) {
            this.props.onClick();
        }
    };
}
