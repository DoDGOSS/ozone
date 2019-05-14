import * as React from "react";
import { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, ButtonGroup, Classes, Dialog, Divider, Intent, ITreeNode, Spinner } from "@blueprintjs/core";

import {
    CompactAddButton,
    CompactDeleteButton,
    CompactEditButton,
    CompactRestoreButton,
    CompactShareButton
} from "../generic-table/TableButtons";

import { mainStore } from "../../stores/MainStore";

import { dashboardApi } from "../../api/clients/DashboardAPI";
import { stackApi } from "../../api/clients/StackAPI";

import { showConfirmationDialog } from "../confirmation-dialog/InPlaceConfirmationDialog";
import { EditDashboardForm } from "../create-dashboard-screen/EditDashboardForm";

import { DashboardDTO } from "../../api/models/DashboardDTO";
import { StackDTO } from "../../api/models/StackDTO";
import { GenericTree } from "../generic-tree/GenericTree";
import { CreateDashboardForm } from "../create-dashboard-screen/CreateDashboardForm";
import { EditStackForm } from "../create-stack-screen/EditStackForm";
import { userDashboardApi } from "../../api/clients/UserDashboardAPI";
import { UserDashboardDTO } from "../../api/models/UserDashboardDTO";

// TODO - iconImageUrl not saving to database - clientAPI
// TODO - style image

const fetchUserDashboardsAndStacks = (
    dispatchDashboardResult: (dashboards: DashboardDTO[]) => void,
    dispatchStackResult: (stacks: StackDTO[]) => void,
    dispatchDashboardState: (dashLoading: boolean) => void,
    dispatchStackState: (stackLoading: boolean) => void
) => {
    userDashboardApi.getOwnDashboards().then((ownDashboardResponse) => {
        if (ownDashboardResponse.status !== 200) return;
        const userDashboards: UserDashboardDTO[] = ownDashboardResponse.data.dashboards;

        dashboardApi.getDashboards().then((dashboardResponse) => {
            if (dashboardResponse.status !== 200) return;

            dispatchDashboardResult(
                dashboardResponse.data.data.filter((dashboard) =>
                    userDashboards.some((userDashboard) => userDashboard.guid === dashboard.guid)
                )
            );
            dispatchDashboardState(false);
        });

        stackApi.getStacks().then((stackResponse) => {
            if (stackResponse.status !== 200) return;

            dispatchStackResult(
                stackResponse.data.data.filter((stack) =>
                    userDashboards.some((userDashboard) => userDashboard.stack.id === stack.id)
                )
            );
            dispatchStackState(false);
        });
    });
};

export const StackDialog: React.FC<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isStackDialogVisible);

    const [showDashboardEdit, setDashboardEdit] = useState(false);
    const [showStackEdit, setStackEdit] = useState(false);
    const [showAddDashboard, setAddDashboard] = useState(false);
    const [currentDashboard, setCurrentDashboard] = useState<DashboardDTO | null>(null);
    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);
    const [currentStack, setCurrentStack] = useState<StackDTO | null>(null);
    const [stacks, setStacks] = useState<StackDTO[]>([]);
    const [stacksLoading, setStacksLoading] = useState(true);
    const [dashLoading, setDashLoading] = useState(true);

    useEffect(() => {
        if (isVisible) {
            fetchData();
        }
    }, [isVisible]);

    function fetchData() {
        setStacksLoading(true);
        setDashLoading(true);
        fetchUserDashboardsAndStacks(setDashboards, setStacks, setDashLoading, setStacksLoading);
    }

    function notOnlyDefaultDashboardInStack(stack: StackDTO) {
        const numOfDashboards = dashboards.filter((dashboard) => {
            if (dashboard.stack && dashboard.stack.id === stack.id) {
                return dashboard;
            }
        }).length;

        const hasDefaultDashboard: boolean = dashboards
            .filter((dashboard) => dashboard.stack!.id === stack.id)
            .some((dashboard) => dashboard.name === stack.name);

        return numOfDashboards > 1 || (!hasDefaultDashboard && numOfDashboards > 0);
    }

    const addNewDashboardToStack = async (stack: StackDTO) => {
        setCurrentStack(stack);
        setAddDashboard(true);
    };

    const onAddNewDashboardSubmitted = () => {
        setAddDashboard(false);
        fetchData();
    };

    const restoreStack = async (stack: StackDTO) => {
        console.log("RESTORE STACK HERE.  Stack is: " + JSON.stringify(stack));
    };

    const restoreDashboard = async (dashboard: DashboardDTO) => {
        console.log("RESTORE DASHBOARD HERE.  Dashboard is: " + JSON.stringify(dashboard));
    };

    const showEditDashboardDialog = async (dashboard: DashboardDTO) => {
        setDashboardEdit(true);
        setCurrentDashboard(dashboard);
    };

    const showEditStackDialog = async (stack: StackDTO) => {
        setStackEdit(true);
        setCurrentStack(stack);
    };

    const onDashboardEditSubmitted = () => {
        setDashboardEdit(false);
        fetchData();
        return true;
    };

    const onStackEditSubmitted = () => {
        setStackEdit(false);
        fetchData();
        return true;
    };

    const confirmStackDelete = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: stack.name, style: "bold" }, "."],
            onConfirm: () => onDeleteStackConfirmed(stack)
        });
    };

    const confirmDashboardDelete = async (dashboard: DashboardDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: dashboard.name, style: "bold" }, "."],
            onConfirm: () => onDeleteDashboardConfirmed(dashboard)
        });
    };

    const confirmShare = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "You are allowing ",
                { text: stack.name, style: "bold" },
                " to be shared with other users. Press OK to confirm."
            ],
            onConfirm: () => onShareConfirmed(stack)
        });
    };

    const onDeleteStackConfirmed = async (stack: StackDTO) => {
        const response = await stackApi.deleteStackAsAdmin(stack.id);
        if (response.status !== 200) return false;

        fetchData();
        return true;
    };

    const onDeleteDashboardConfirmed = async (dashboard: DashboardDTO) => {
        const response = await dashboardApi.deleteDashboard(dashboard.guid);
        if (response.status !== 200) return false;

        fetchData();
        return true;
    };

    const onShareConfirmed = async (stack: StackDTO) => {
        const response = await stackApi.shareStack(stack.id);
        if (response.status !== 200) return false;

        fetchData();
        return true;
    };

    return (
        <div>
            {!(showDashboardEdit || showStackEdit) && (
                <Dialog className={themeClass} isOpen={isVisible} onClose={mainStore.hideStackDialog} title="Stacks">
                    <div className={Classes.DIALOG_BODY} data-element-id={"stack-dialog"}>
                        {stacksLoading || dashLoading ? (
                            <Spinner />
                        ) : (
                            <GenericTree
                                nodes={stacks.map((stack) => {
                                    const stackNode: ITreeNode = {
                                        id: stack.id,
                                        hasCaret: notOnlyDefaultDashboardInStack(stack),
                                        label: stack.name,
                                        icon: "control",
                                        isExpanded:
                                            notOnlyDefaultDashboardInStack(stack) &&
                                            currentStack &&
                                            currentStack.id === stack.id
                                                ? true
                                                : false,
                                        secondaryLabel: (
                                            <ButtonGroup
                                                data-element-id={"stack-actions"}
                                                data-role={"stack-actions"}
                                                data-name={stack.name}
                                            >
                                                <Divider />
                                                <CompactAddButton
                                                    itemName="Add New Dashboard"
                                                    onClick={() => addNewDashboardToStack(stack)}
                                                />
                                                <Divider />
                                                <CompactShareButton
                                                    itemName={
                                                        stack.approved
                                                            ? "Only Approved/Non-Shared Stacks Can Be Shared"
                                                            : "Share Stack"
                                                    }
                                                    disabled={stack.approved}
                                                    onClick={() => confirmShare(stack)}
                                                />
                                                <Divider />
                                                <CompactRestoreButton
                                                    itemName="Restore Stack"
                                                    onClick={() => restoreStack(stack)}
                                                />
                                                <Divider />
                                                <CompactEditButton
                                                    itemName="Edit Stack"
                                                    onClick={() => showEditStackDialog(stack)}
                                                />
                                                <Divider />
                                                <CompactDeleteButton
                                                    itemName="Delete Stack"
                                                    onClick={() => confirmStackDelete(stack)}
                                                />
                                                <Divider />
                                            </ButtonGroup>
                                        ),
                                        childNodes: dashboards
                                            .filter((dashboard) => dashboard.stack!.id === stack.id)
                                            .map((dashboard) => {
                                                const dashNode: ITreeNode = {
                                                    id: dashboard.guid,
                                                    hasCaret: false,
                                                    label: dashboard.name,
                                                    icon: "control",
                                                    secondaryLabel: (
                                                        <ButtonGroup
                                                            data-element-id={"dashboard-actions"}
                                                            data-role={"dashboard-actions"}
                                                            data-name={dashboard.name}
                                                        >
                                                            <Divider />
                                                            <CompactRestoreButton
                                                                itemName="Restore Dashboard"
                                                                onClick={() => restoreDashboard(dashboard)}
                                                            />
                                                            <Divider />
                                                            <CompactEditButton
                                                                itemName="Edit Dashboard"
                                                                onClick={() => showEditDashboardDialog(dashboard)}
                                                            />
                                                            <Divider />
                                                            <CompactDeleteButton
                                                                itemName="Delete Dashboard"
                                                                onClick={() => confirmDashboardDelete(dashboard)}
                                                            />
                                                            <Divider />
                                                        </ButtonGroup>
                                                    )
                                                };
                                                return dashNode;
                                            })
                                    };
                                    return stackNode;
                                })}
                            />
                        )}
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() => {
                                    mainStore.hideStackDialog();
                                    mainStore.showCreateStackDialog();
                                }}
                                icon="add"
                                data-element-id="stack-create-button"
                                intent={Intent.NONE}
                            >
                                Create New
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
            {showDashboardEdit && currentDashboard && (
                <Dialog
                    className={themeClass}
                    isOpen={showDashboardEdit}
                    onClose={() => setDashboardEdit(false)}
                    title="Edit Dashboard"
                >
                    <div data-element-id="EditDashboardDialog" className={Classes.DIALOG_BODY}>
                        <EditDashboardForm dashboard={currentDashboard} onSubmit={onDashboardEditSubmitted} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
            {showStackEdit && currentStack && (
                <Dialog
                    className={themeClass}
                    isOpen={showStackEdit}
                    onClose={() => setStackEdit(false)}
                    title="Edit Stack"
                >
                    <div data-element-id="EditStackDialog" className={Classes.DIALOG_BODY}>
                        <EditStackForm stack={currentStack} onSubmit={onStackEditSubmitted} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
            {showAddDashboard && currentStack && (
                <Dialog
                    className={themeClass}
                    isOpen={showAddDashboard}
                    onClose={() => setAddDashboard(false)}
                    title="Create New Dashboard"
                >
                    <div data-element-id="CreateDashboardDialog" className={Classes.DIALOG_BODY}>
                        <CreateDashboardForm stackId={currentStack.id} onSubmit={onAddNewDashboardSubmitted} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
        </div>
    );
};
