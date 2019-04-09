import * as styles from "./DashboardTabbedPanel.scss";

import React, { useCallback, useMemo } from "react";
import { useBehavior } from "../../../hooks";

import { Button, Tab, Tabs } from "@blueprintjs/core";

import { Panel } from "../../../models/dashboard/types";
import { TabbedPanel } from "../../../models/dashboard/TabbedPanel";
import { UserWidget } from "../../../models/UserWidget";

import { WidgetFrame } from "../WidgetFrame";

export interface DashboardTabbedPanelProps {
    panel: TabbedPanel;
}

export const DashboardTabbedPanel: React.FC<DashboardTabbedPanelProps> = ({ panel }) => {
    const { widgets, activeWidget } = useBehavior(panel.state);

    const widgetTitles = useMemo(() => widgets.map((widget) => createWidgetTabTitle(panel, widget)), [widgets]);
    const setActiveWidget = useCallback((newTabId: string) => panel.setActiveWidget(newTabId.substring(4)), [panel]);

    return (
        <Tabs
            selectedTabId={activeWidget ? `tab-${activeWidget.id}` : undefined}
            onChange={setActiveWidget}
            className={styles.tabsList}
            animate={false}
        >
            {widgets.map((widget, idx) => (
                <Tab
                    key={`tab-${widget.id}`}
                    id={`tab-${widget.id}`}
                    className={styles.tab}
                    title={widgetTitles[idx]}
                    panel={<WidgetFrame widget={widget} />}
                />
            ))}
        </Tabs>
    );
};

function createWidgetTabTitle(panel: Panel<any>, widget: UserWidget): JSX.Element {
    return (
        <>
            <span className={styles.tabTitle}>{widget.widget.title}</span>
            <Button
                className={styles.tabTitleClose}
                icon="cross"
                minimal={true}
                onClick={() => panel.closeWidget(widget.widget.id)}
            />
        </>
    );
}
