import React from "react";
import { useBehavior } from "../../../hooks";

import { FitPanel } from "../../../models/panel";

import { WidgetFrame } from "../WidgetFrame";

export interface DashboardFitPanelProps {
    panel: FitPanel;
}

const _DashboardFitPanel: React.FC<DashboardFitPanelProps> = ({ panel }) => {
    const { widgets } = useBehavior(panel.state);

    const widget = widgets.length >= 1 ? widgets[0] : null;

    if (widget === null) return null;

    return <WidgetFrame widgetInstance={widget} />;
};

export const DashboardFitPanel = React.memo(_DashboardFitPanel);
