import styles from "./DashboardTabbedPanel.scss";

import React, { useCallback, useMemo } from "react";
import { useBehavior } from "../../../hooks";

import { Button } from "@blueprintjs/core";

import { Tab } from "./tabs/tab";
import { Tabs } from "./tabs/tabs";

import { Panel, TabbedPanel } from "../../../models/panel";
import { UserWidget } from "../../../models/UserWidget";

import { WidgetFrame } from "../WidgetFrame";

export interface DashboardTabbedPanelProps {
    panel: TabbedPanel;
}

export const DashboardTabbedPanel: React.FC<DashboardTabbedPanelProps> = ({ panel }) => {
    const { widgets, activeWidget } = useBehavior(panel.state);

    const widgetTitles = useMemo(() => widgets.map((widget) => createWidgetTabTitle(panel, widget.userWidget)), [
        widgets
    ]);
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
                    widgetInstanceId={widget.id}
                    className={styles.tab}
                    title={widgetTitles[idx]}
                    panel={<WidgetFrame widgetInstance={widget} />}
                />
            ))}
        </Tabs>
    );
};

function createWidgetTabTitle(panel: Panel<any>, userWidget: UserWidget): JSX.Element {
    return (
        <>
            <span className={styles.tabTitle}>{userWidget.widget.title}</span>
            <Button
                className={styles.tabTitleClose}
                icon="cross"
                minimal={true}
                onClick={() => panel.closeWidget(userWidget.widget.id)}
            />
        </>
    );
}
