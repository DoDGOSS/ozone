import styles from "../index.module.scss";

import React from "react";

import { UserWidget } from "../../../models/UserWidget";
import { dashboardService } from "../../../services/DashboardService";

import { UserWidgetTile } from "../../widget-tile";

export interface AvailableWidgetsListProps {
    widgets: UserWidget[];
}

export const AvailableWidgetsList: React.FC<AvailableWidgetsListProps> = (props) => {
    const { widgets } = props;

    return (
        <div>
            <div>Available Widgets</div>
            <div className={styles.tileContainer}>
                {widgets.map((widget) => (
                    <UserWidgetTile
                        key={widget.id}
                        userWidget={widget}
                        onClick={() => {
                            dashboardService.addWidget({ widget });
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
