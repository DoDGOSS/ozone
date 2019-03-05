import * as React from "react";
import { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, ButtonGroup, Card, Classes, Dialog, Divider, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";

import { dashboardApi } from "../../api/clients/DashboardAPI";
import {DashboardDTO, DashboardUpdateRequest} from "../../api/models/DashboardDTO";
import { ConfirmationDialog } from "../confirmation-dialog/ConfirmationDialog";
import { EditDashboardForm } from "../create-dashboard-screen/EditDashboardForm";

//TODO - convert to edit stacks
//TODO - iconImageUrl not saving to database - clientAPI
//TODO - style image

export const DashboardDialog: React.FunctionComponent<{}> = () => {
    const initialDashboardState = {
        name: '',
        guid: '',
        description: '',
        iconImageUrl: ''
    };

    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isDashboardDialogVisible);

    const [showDelete, setDelete] = useState(false);
    const [showEdit, setEdit] = useState(false);
    const [dashboard, setDashboard] = useState<DashboardUpdateRequest>(initialDashboardState);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);

    useEffect(() => {
        // TODO: Handle failed request
        dashboardApi.getDashboards().then((response) => {
            if (response.status !== 200) return;
            setDashboards(response.data.data);
        });
    }, [dashboards]);

    const editDashboard = async (dashboard: DashboardDTO) => {
        setEdit(true);
        setDashboard(dashboard);
    };

    const deleteDashboard = async (dashboard: DashboardDTO) => {
        setDelete(true);
        setConfirmationMessage(`This action will permanently delete <strong>${dashboard.name}</strong>`);
        setDashboard(dashboard);
    };

    const handleConfirmationConfirmDelete = async () => {
        setDelete(false);
        setDashboard(initialDashboardState);
        setConfirmationMessage("");

        const response = await dashboardApi.deleteDashboard(dashboard.guid);

        if (response.status !== 200) return false;

        return true;
    };

    const handleConfirmationCancel = () => {
        setDelete(false);
        setDashboard(initialDashboardState);
    };

    const handleUpdate = () => {
        setEdit(false);
        return true;
    };

    return (
        <div>
            {showDelete && (
                <ConfirmationDialog
                    show={showDelete}
                    title={"Warning"}
                    content={confirmationMessage}
                    confirmHandler={handleConfirmationConfirmDelete}
                    cancelHandler={handleConfirmationCancel}
                    payload={dashboard}
                />
            )}

            {!showEdit ? (
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
                                <ButtonGroup>
                                    <Button
                                        key={dashboard.guid}
                                        value={dashboard.name}
                                        icon="edit"
                                        text="Edit"
                                        data-element-id={"dashboard-edit-button-" + dashboard.name}
                                        onClick={() => editDashboard(dashboard)}
                                    />
                                    <Divider />
                                    <Button
                                        data-element-id={"dashboard-delete-button-" + dashboard.name}
                                        text="Delete"
                                        intent={Intent.DANGER}
                                        icon="trash"
                                        onClick={() => deleteDashboard(dashboard)}
                                    />
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
            ) : (
                <Dialog className={themeClass} isOpen={showEdit} onClose={() => setEdit(false)} title="Edit Dashboard">
                    <div data-element-id="EditDashboardDialog" className={Classes.DIALOG_BODY}>
                        <EditDashboardForm dashboard={dashboard} onSubmit={handleUpdate} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
        </div>
    );
};
