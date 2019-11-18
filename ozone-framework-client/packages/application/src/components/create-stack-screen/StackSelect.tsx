import * as React from "react";
import { useEffect, useState } from "react";

import { dashboardApi } from "../../api/clients/DashboardAPI";

import { DashboardDTO } from "../../api/models/DashboardDTO";

import * as styles from "./index.scss";
import { ListOf, Response } from "../../api/interfaces";

export const DashboardSelect: React.FC<{}> = () => {
    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);

    useEffect(() => {
        // TODO: Handle failed request
        dashboardApi.getDashboards().then((response: Response<ListOf<DashboardDTO[]>>) => {
            if (!(response.status >= 200 && response.status < 400)) return;
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
