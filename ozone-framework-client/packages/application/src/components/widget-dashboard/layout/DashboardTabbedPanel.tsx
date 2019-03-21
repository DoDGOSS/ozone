import React, { useCallback, useMemo } from "react";
import { useBehavior } from "../../../hooks";

import { Button, Tab, Tabs } from "@blueprintjs/core";

import { Widget } from "../../../stores/interfaces";

import { TabbedPanel } from "../model/TabbedPanel";
import { WidgetFrame } from "../WidgetFrame";

import * as styles from "./DashboardTabbedPanel.scss";
import { Panel } from "../model/types";

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

function createWidgetTabTitle(panel: Panel<any>, widget: Widget): JSX.Element {
    return (
        <>
            <span className={styles.tabTitle}>{widget.definition.title}</span>
            <Button
                className={styles.tabTitleClose}
                icon="cross"
                minimal={true}
                onClick={() => panel.closeWidget(widget.id)}
            />
        </>
    );
}
