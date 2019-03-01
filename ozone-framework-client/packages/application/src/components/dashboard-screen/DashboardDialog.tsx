import * as React from "react";
import { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, Classes, Dialog } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";

import { dashboardApi } from "../../api/clients/DashboardAPI";
import { DashboardDTO } from "../../api/models/DashboardDTO";

export const DashboardDialog: React.FunctionComponent<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isDashboardDialogVisible);

    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);
    useEffect(() => {
        // TODO: Handle failed request
        dashboardApi.getDashboards().then((response) => {
            if (response.status !== 200) return;
            setDashboards(response.data.data);
        });
    }, []);

    return (
        <div>
            <Dialog
                className={themeClass}
                isOpen={isVisible}
                onClose={mainStore.hideDashboardDialog}
                title="Dashboards"
            >
                <div className={Classes.DIALOG_BODY}>
                    {dashboards.map((dashboard) => (
                        <button className="layout" key={dashboard.guid} value={dashboard.name}>
                            <p>{dashboard.name}</p>
                            <img src={dashboard.iconImageUrl} />
                        </button>
                    ))}
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            onClick={() => {
                                mainStore.hideDashboardDialog();
                                mainStore.showCreateDashboardDialog();
                            }}
                            icon="insert"
                            data-element-id="CreateDashboardButton"
                        >
                            Create New
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
