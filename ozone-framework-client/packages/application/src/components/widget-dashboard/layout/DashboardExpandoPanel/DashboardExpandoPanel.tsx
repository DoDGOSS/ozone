import styles from "./index.module.scss";

import React from "react";
import { useBehavior } from "../../../../hooks";
import { classNames } from "../../../../utility";

import { ExpandoPanel } from "../../../../models/panel";

import { ExpandoContainer } from "./ExpandoContainer";

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
