import styles from "../index.scss";

import React from "react";
import { Position, Tooltip } from "@blueprintjs/core";

import { TOOLTIP_DELAY_MS } from "../../../constants";

export type NavbarTooltipProps = {
    children?: any;
    description: string;
    disabled?: boolean;
    shortcut?: string;
    title: string;
};

export const NavbarTooltip: React.FC<NavbarTooltipProps> = (props) => {
    const { children, description, disabled, shortcut, title } = props;

    if (disabled) return children;

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
};
