import React from "react";
import { useBehavior } from "../../../hooks";

import { FitPanel } from "../../../models/dashboard/FitPanel";
import { WidgetFrame } from "../WidgetFrame";

export interface DashboardFitPanelProps {
    panel: FitPanel;
}

const _DashboardFitPanel: React.FC<DashboardFitPanelProps> = ({ panel }) => {
    const { widgets } = useBehavior(panel.state);

    const widget = widgets.length >= 1 ? widgets[0] : null;

    if (widget === null) {
        return <div>Placeholder</div>;
    } else {
        return <WidgetFrame widget={widget} />;
    }
};

export const DashboardFitPanel = React.memo(_DashboardFitPanel);
