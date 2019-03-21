import * as styles from "./index.scss";

import * as React from "react";

import { Position, Tooltip } from "@blueprintjs/core";

import { TOOLTIP_DELAY_MS } from "../../constants";

export type NavbarTooltipProps = {
    title: string;
    shortcut?: string;
    description: string;

    children?: any;
};

export class NavbarTooltip extends React.PureComponent<NavbarTooltipProps> {
    render() {
        const { children, title, shortcut, description } = this.props;

        const content = (
            <div className={styles.tooltip}>
                <div className={styles.tooltipHeader}>
                    <span className={styles.tooltipTitle}>{title}</span>
                    {shortcut && <span className={styles.tooltipShortcut}>({shortcut})</span>}
                </div>
                <div className={styles.tooltipDescription}>{description}</div>
            </div>
        );

        return (
            <Tooltip position={Position.BOTTOM} hoverOpenDelay={TOOLTIP_DELAY_MS} content={content}>
                {children}
            </Tooltip>
        );
    }
}
