import styles from "./index.module.scss";

import React, { useCallback } from "react";
import { useBehavior } from "../../../../hooks";

import { TabbedPanel } from "../../../../models/panel";

import { Tab, Tabs } from "../tabs";
import { WidgetFrame } from "../../WidgetFrame";
import { WidgetTabTitle } from "./WidgetTabTitle";

export interface DashboardTabbedPanelProps {
    panel: TabbedPanel;
}

export const DashboardTabbedPanel: React.FC<DashboardTabbedPanelProps> = ({ panel }) => {
    const { widgets, activeWidget } = useBehavior(panel.state);

    const setActiveWidget = useCallback((newTabId: string) => panel.setActiveWidget(newTabId.substring(4)), [panel]);

    return (
        <Tabs
            id={panel.id}
            selectedTabId={activeWidget ? `tab-${activeWidget.id}` : undefined}
            onChange={setActiveWidget}
            className={styles.dashboardPanelTabsList}
            animate={false}
        >
            {widgets.map((widget, idx) => (
                <Tab
                    key={`tab-${widget.id}`}
                    id={`tab-${widget.id}`}
                    widgetInstanceId={widget.id}
                    className={styles.dashboardTab}
                    title={<WidgetTabTitle panel={panel} widget={widget} />}
                    panel={<WidgetFrame widgetInstance={widget} />}
                />
            ))}
        </Tabs>
    );
};
