import React, { useCallback } from "react";
import { useBehavior } from "../../../hooks";

import { Button } from "@blueprintjs/core";

import { Widget } from "../../../stores/interfaces";

import { ExpandoPanel } from "../model/ExpandoPanel";
import { WidgetFrame } from "../WidgetFrame";

import { classNames } from "../../../utility";

import * as styles from "./DashboardExpandoPanel.scss";

export interface ExpandoHeaderProps {
    panel: ExpandoPanel;
    widget: Widget;
    collapsed: boolean;
}

const ExpandoHeader: React.FC<ExpandoHeaderProps> = ({ panel, widget, collapsed }) => {
    const collapseIcon = collapsed ? "plus" : "minus";
    const toggleCollapsed = useCallback(() => panel.setCollapsed(widget.id, !collapsed), [widget, collapsed]);
    const closeWidget = useCallback(() => panel.closeWidget(widget.id), [panel, widget]);

    return (
        <div className={styles.header}>
            <span className={styles.headerTitle}>{widget.definition.title}</span>
            <span className={styles.headerControls}>
                <Button className={styles.headerButton} icon={collapseIcon} minimal={true} onClick={toggleCollapsed} />
                <Button className={styles.headerButton} icon="cross" minimal={true} onClick={closeWidget} />
            </span>
        </div>
    );
};

export interface ExpandoContainerProps {
    panel: ExpandoPanel;
    widget: Widget;
    collapsed: boolean;
}

const ExpandoContainer: React.FC<ExpandoContainerProps> = ({ panel, widget, collapsed }) => {
    const classes = classNames(styles.container, { [styles.collapsed]: collapsed });

    return (
        <div className={classes}>
            <ExpandoHeader panel={panel} widget={widget} collapsed={collapsed} />
            <div className={styles.frameWrapper}>
                <WidgetFrame widget={widget} />
            </div>
        </div>
    );
};

export interface DashboardExpandoPanelProps {
    panel: ExpandoPanel;
}

export const DashboardExpandoPanel: React.FC<DashboardExpandoPanelProps> = ({ panel }) => {
    const { type, widgets, collapsed } = useBehavior(panel.state);

    const expandoClass = type === "accordion" ? styles.accordion : styles.portal;
    const classes = classNames(styles.panel, expandoClass);

    return (
        <div className={classes}>
            {widgets.map((widget, idx) => (
                <ExpandoContainer key={widget.id} panel={panel} widget={widget} collapsed={collapsed[idx]} />
            ))}
        </div>
    );
};
