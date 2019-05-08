import * as React from "react";
import { useEffect, useState } from "react";

import { dashboardApi } from "../../api/clients/DashboardAPI";

import { DashboardDTO } from "../../api/models/DashboardDTO";
import { Field, FieldProps } from "formik";

import * as styles from "./index.scss";

export interface CopyLayoutsProps {
    onChange: (event: React.FormEvent) => void;
    selectedValue: string | "";
}

const _DashboardSelect: React.FC<CopyLayoutsProps & FieldProps<any>> = (props) => {
    const { onChange, selectedValue } = props;
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
            <select onChange={onChange}>
                <option key='default' value='default'>Select</option>
                {dashboards.map((dashboard) => (
                    <option key={dashboard.guid} value={dashboard.guid}>
                        {dashboard.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export const DashboardSelect: React.FC<CopyLayoutsProps> = (props) => (
    <Field component={_DashboardSelect} {...props} />
);
