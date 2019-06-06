/* tslint:disable:member-ordering */

import React from "react";
import classNames from "classnames";
import { clamp, throttle } from "lodash";

import { EnabledResizeOptions, MosaicDirection } from "./types";

import { asStyles, BoundingBox, getAbsoluteSplitPercentage, getRelativeSplitPercentage } from "./util/BoundingBox";

const RESIZE_THROTTLE_MS = 1000 / 30; // 30 fps

export interface SplitProps extends EnabledResizeOptions {
    direction: MosaicDirection;
    boundingBox: BoundingBox;
    splitPercentage: number;
    onChange?: (percentOfParent: number) => void;
    onRelease?: (percentOfParent: number) => void;
}

export class Split extends React.PureComponent<SplitProps> {
    private rootElement: HTMLDivElement | null = null;

    static defaultProps = {
        onChange: () => void 0,
        onRelease: () => void 0,
        minimumPaneSizePercentage: 20
    };

    render() {
        const { direction } = this.props;
        return (
            <div
                className={classNames("mosaic-split", {
                    "-row": direction === "row",
                    "-column": direction === "column"
                })}
                ref={(el) => (this.rootElement = el)}
                onMouseDown={this.onMouseDown}
                style={this.computeStyle()}
            >
                <div className="mosaic-split-line" />
            </div>
        );
    }

    componentWillUnmount() {
        if (this.rootElement) {
            this.rootElement.ownerDocument!.removeEventListener("mousemove", this.onMouseMove, true);
            this.rootElement.ownerDocument!.removeEventListener("mouseup", this.onMouseUp, true);
        }
    }

    private computeStyle() {
        const { boundingBox, direction, splitPercentage } = this.props;
        const positionStyle = direction === "column" ? "top" : "left";
        const absolutePercentage = getAbsoluteSplitPercentage(boundingBox, splitPercentage, direction);
        return {
            ...asStyles(boundingBox),
            [positionStyle]: `${absolutePercentage}%`
        };
    }

    private onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        this.rootElement!.ownerDocument!.addEventListener("mousemove", this.onMouseMove, true);
        this.rootElement!.ownerDocument!.addEventListener("mouseup", this.onMouseUp, true);
    };

    private onMouseUp = (event: MouseEvent) => {
        this.rootElement!.ownerDocument!.removeEventListener("mousemove", this.onMouseMove, true);
        this.rootElement!.ownerDocument!.removeEventListener("mouseup", this.onMouseUp, true);

        const percentage = this.calculateRelativePercentage(event);
        this.props.onRelease!(percentage);
    };

    private onMouseMove = throttle((event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const percentage = this.calculateRelativePercentage(event);
        if (percentage !== this.props.splitPercentage) {
            this.props.onChange!(percentage);
        }
    }, RESIZE_THROTTLE_MS);

    private calculateRelativePercentage(event: MouseEvent): number {
        const { minimumPaneSizePercentage, direction, boundingBox } = this.props;
        const parentBBox = this.rootElement!.parentElement!.getBoundingClientRect();

        let absolutePercentage: number;
        if (direction === "column") {
            absolutePercentage = ((event.clientY - parentBBox.top) / parentBBox.height) * 100.0;
        } else {
            absolutePercentage = ((event.clientX - parentBBox.left) / parentBBox.width) * 100.0;
        }

        const relativePercentage = getRelativeSplitPercentage(boundingBox, absolutePercentage, direction);

        return clamp(relativePercentage, minimumPaneSizePercentage!, 100 - minimumPaneSizePercentage!);
    }
}
