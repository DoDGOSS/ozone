import styles from "./index.module.scss";

import React from "react";
import { classNames } from "../../../../utility";

import { ExpandoPanel } from "../../../../models/panel";
import { WidgetInstance } from "../../../../models/WidgetInstance";

import { WidgetFrame } from "../../WidgetFrame";

import { ExpandoHeader } from "./ExpandoHeader";

export interface ExpandoContainerProps {
    panel: ExpandoPanel;
    widget: WidgetInstance;
    collapsed: boolean;
}

export const ExpandoContainer: React.FC<ExpandoContainerProps> = ({ panel, widget, collapsed }) => {
    const classes = classNames(styles.container, { [styles.collapsed]: collapsed });

    return (
        <div className={classes}>
            <ExpandoHeader panel={panel} widget={widget} collapsed={collapsed} />
            <div className={styles.frameWrapper}>
                <WidgetFrame widgetInstance={widget} />
            </div>
        </div>
    );
};
