import * as styles from "./NavbarTooltip.scss";

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
                <div className={styles.header}>
                    <span className={styles.title}>{title}</span>
                    {shortcut && <span className={styles.shortcut}>({shortcut})</span>}
                </div>
                <div className={styles.description}>{description}</div>
            </div>
        );

        return (
            <Tooltip position={Position.BOTTOM} hoverOpenDelay={TOOLTIP_DELAY_MS} content={content}>
                {children}
            </Tooltip>
        );
    }
}
