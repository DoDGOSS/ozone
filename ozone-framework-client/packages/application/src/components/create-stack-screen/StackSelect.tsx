import * as React from "react";
import { useEffect, useState } from "react";

import { dashboardApi } from "../../api/clients/DashboardAPI";

import { DashboardDTO } from "../../api/models/DashboardDTO";

import * as styles from "./index.scss";

export const DashboardSelect: React.FC<{}> = () => {
    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);

    useEffect(() => {
        // TODO: Handle failed request
        dashboardApi.getDashboards().then((response) => {
            if (response.status !== 200) return;
            setDashboards(response.data.data);
        });
    }, []);

    return (
        <div className={styles.select} data-element-id="DashboardSelect">
            <select>
                {dashboards.map((dashboard) => (
                    <option key={dashboard.guid} value={dashboard.name}>
                        {dashboard.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
