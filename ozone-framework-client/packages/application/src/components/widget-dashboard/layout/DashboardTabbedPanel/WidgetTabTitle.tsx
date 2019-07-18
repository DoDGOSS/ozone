import styles from "./index.module.scss";

import React, { useCallback, useMemo } from "react";
import { useBehavior } from "../../../../hooks";
import { Button } from "@blueprintjs/core";

import { TabbedPanel } from "../../../../models/panel";
import { WidgetInstance } from "../../../../models/WidgetInstance";
import { dashboardService } from "../../../../services/DashboardService";
import { dashboardStore } from "../../../../stores/DashboardStore";

export interface WidgetTabTitleProps {
    panel: TabbedPanel;
    widget: WidgetInstance;
}

export const WidgetTabTitle: React.FC<WidgetTabTitleProps> = (props) => {
    const { panel, widget } = props;

    const dashboard = useBehavior(dashboardStore.currentDashboard);
    const { isLocked } = useBehavior(dashboard.state);

    const { widgets } = useBehavior(panel.state);
    const controls = useMemo(() => panel.getMoveControls(widget), [widgets]);

    const closeWidget = useCallback(() => dashboardService.closeWidgetById(widget.id), [panel, widget]);

    return (
        <div className={styles.tabTitle}>
            <span className={styles.tabTitleText}>{widget.userWidget.title}</span>
            {!isLocked && <Button className={styles.tabTitleClose} icon="cross" minimal={true} onClick={closeWidget} />}
            {!isLocked && controls.canMoveLeft && (
                <Button
                    className={styles.tabTitleMove}
                    icon="chevron-left"
                    minimal={true}
                    onClick={controls.moveLeft}
                />
            )}
            {!isLocked && controls.canMoveRight && (
                <Button
                    className={styles.tabTitleMove}
                    icon="chevron-right"
                    minimal={true}
                    onClick={controls.moveRight}
                />
            )}
        </div>
    );
};
