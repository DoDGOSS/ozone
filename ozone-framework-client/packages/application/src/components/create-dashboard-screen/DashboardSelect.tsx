import * as React from "react";
import { useEffect, useState } from "react";

import { dashboardApi } from "../../api/clients/DashboardAPI";

import { DashboardDTO } from "../../api/models/DashboardDTO";
import { Field, FieldProps } from "formik";

import * as styles from "./index.scss";
import { ListOf, Response } from "../../api/interfaces";

export interface CopyLayoutsProps {
    onChange: (event: React.FormEvent) => void;
    selectedValue?: number;
}

const _DashboardSelect: React.FC<CopyLayoutsProps & FieldProps<any>> = (props) => {
    const { onChange } = props;
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
            <select onChange={onChange} data-element-id="Select" className="select-css">
                <option key="default" value={0}>
                    Select
                </option>
                {dashboards.map((dashboard) => (
                    <option key={dashboard.id} value={dashboard.id}>
                        {dashboard.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export const DashboardSelect: React.FC<CopyLayoutsProps> = (props) => <Field component={_DashboardSelect} {...props} />;
