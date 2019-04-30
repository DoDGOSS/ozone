import * as React from "react";
import { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, ButtonGroup, Card, Classes, Dialog, Divider, Intent } from "@blueprintjs/core";

import { DeleteButton, EditButton, ShareButton } from "../generic-table/TableButtons";

import { mainStore } from "../../stores/MainStore";
import { errorStore } from "../../services/ErrorStore";

import { dashboardApi } from "../../api/clients/DashboardAPI";
import { stackApi } from "../../api/clients/StackAPI";
import { DashboardDTO } from "../../api/models/DashboardDTO";
import { showConfirmationDialog } from "../confirmation-dialog/InPlaceConfirmationDialog";
import { EditDashboardForm } from "../create-dashboard-screen/EditDashboardForm";

// TODO - convert to edit stacks
// TODO - iconImageUrl not saving to database - clientAPI
// TODO - style image
// TODO - Modify share button when multipage support is added

const fetchDashboards = (dispatchResult: (dashboards: DashboardDTO[]) => void) => {
    dashboardApi.getDashboards().then((response) => {
        if (response.status !== 200) return;

        dispatchResult(response.data.data);
    });
};

export const DashboardDialog: React.FC<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isDashboardDialogVisible);

    const [showDelete, setDelete] = useState(false);
    const [showShare, setShare] = useState(false);
    const [showEdit, setEdit] = useState(false);
    const [currentDashboard, setCurrentDashboard] = useState<DashboardDTO | null>(null);
    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);

    // Fetch the Dashboards when isVisible changes to `true`
    useEffect(() => {
        if (isVisible) fetchDashboards(setDashboards);
    }, [isVisible]);

    const showEditDialog = async (dashboard: DashboardDTO) => {
        setEdit(true);
        setCurrentDashboard(dashboard);
    };

    const onEditSubmitted = () => {
        setEdit(false);
        fetchDashboards(setDashboards);
        return true;
    };

    const confirmDelete = async (dashboard: DashboardDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: dashboard.name, style: "bold" }, "."],
            onConfirm: () => onDeleteConfirmed(dashboard)
        });
    };

    const confirmShare = async (dashboard: DashboardDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "You are allowing ",
                { text: dashboard.name, style: "bold" },
                "to be shared with other users. Press OK to confirm."
            ],
            onConfirm: () => onShareConfirmed(dashboard)
        });
    };

    const onDeleteConfirmed = async (dashboard: DashboardDTO) => {
        const response = await stackApi.deleteStackAsUser(dashboard.stack!.id);
        if (response.status !== 200) return false;

        fetchDashboards(setDashboards);
        return true;
    };

    const onShareConfirmed = async (dashboard: DashboardDTO) => {
        const response = await stackApi.shareStack(dashboard.stack!.id);
        if (response.status !== 200) return false;

        fetchDashboards(setDashboards);
        return true;
    };

    return (
        <div>
            {!showEdit && (
                <Dialog
                    className={themeClass}
                    isOpen={isVisible}
                    onClose={mainStore.hideDashboardDialog}
                    title="Dashboards"
                >
                    <div className={Classes.DIALOG_BODY} data-element-id={"dashboard-dialog"}>
                        {dashboards.map((dashboard) => (
                            <Card key={dashboard.guid}>
                                <h4>{dashboard.name}</h4>
                                <p>{dashboard.description}</p>
                                <img src={dashboard.iconImageUrl} />
                                <ButtonGroup
                                    data-element-id={"dashboard-actions"}
                                    data-role={"dashboard-actions"}
                                    data-name={dashboard.name}>
                                    <EditButton itemName={dashboard.guid} onClick={() => showEditDialog(dashboard)} />
                                    <Divider />
                                    <ShareButton
                                        itemName={dashboard.guid}
                                        disabled={dashboard.publishedToStore}
                                        onClick={() => confirmShare(dashboard)}
                                    />
                                    <Divider />
                                    <DeleteButton itemName={dashboard.guid} onClick={() => confirmDelete(dashboard)} />
                                </ButtonGroup>
                            </Card>
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
                                data-element-id="dashboard-create-button"
                            >
                                Create New
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
            {showEdit && (
                <Dialog className={themeClass} isOpen={showEdit} onClose={() => setEdit(false)} title="Edit Dashboard">
                    <div data-element-id="EditDashboardDialog" className={Classes.DIALOG_BODY}>
                        <EditDashboardForm dashboard={currentDashboard} onSubmit={onEditSubmitted} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
        </div>
    );
};
