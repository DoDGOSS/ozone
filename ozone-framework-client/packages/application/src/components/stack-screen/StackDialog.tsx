import React, { useEffect, useState } from "react";
import { useBehavior, useStateAsyncInit } from "../../hooks";

import { Button, ButtonGroup, Classes, Dialog, Divider, Intent, ITreeNode, Spinner } from "@blueprintjs/core";

import {
    CompactAddButton,
    CompactDeleteButton,
    CompactEditButton,
    CompactRestoreButton,
    CompactShareButton
} from "../generic-table/TableButtons";

import { mainStore } from "../../stores/MainStore";
import { dashboardStore } from "../../stores/DashboardStore";

import { groupApi } from "../../api/clients/GroupAPI";
import { dashboardApi } from "../../api/clients/DashboardAPI";
import { stackApi } from "../../api/clients/StackAPI";
import { storeMetaAPI } from "../../api/clients/StoreMetaAPI";

import { storeExportService } from "../../services/StoreExportService";
import { authService } from "../../services/AuthService";

import { showConfirmationDialog } from "../confirmation-dialog/showConfirmationDialog";
import { EditDashboardForm } from "../create-dashboard-screen/EditDashboardForm";

import { DashboardDTO } from "../../api/models/DashboardDTO";
import { StackDTO } from "../../api/models/StackDTO";
import { GenericTree } from "../generic-tree/GenericTree";
import { CreateDashboardForm } from "../create-dashboard-screen/CreateDashboardForm";
import { EditStackForm } from "../create-stack-screen/EditStackForm";
import { userDashboardApi } from "../../api/clients/UserDashboardAPI";
import { UserDashboardDTO } from "../../api/models/UserDashboardDTO";

import { uuid } from "../../utility";

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

        authService.check().then(async (currentUser) => {
            const allUserGroupsResponse = await groupApi.getGroups({ user_id: currentUser.data.id });
            if (allUserGroupsResponse.status !== 200) return;
            const allUserGroups = allUserGroupsResponse.data.data;

            const stackResponseForUser = await stackApi.getStacks({ userId: currentUser.data.id });
            if (stackResponseForUser.status !== 200) return;
            const allPermittedStacks = stackResponseForUser.data.data;

            for (const userGroup of allUserGroups) {
                const stackResponseForGroup = await stackApi.getStacks({ groupId: userGroup.id });
                if (stackResponseForGroup.status !== 200) return;

                for (const stack of stackResponseForGroup.data.data) {
                    if (!allPermittedStacks.find((s) => s.stackContext === stack.stackContext)) {
                        allPermittedStacks.push(stack);
                    }
                }
            }

            dispatchStackResult(allPermittedStacks);

            dispatchStackState(false);
        });
    });
};

const checkForStores = async () => {
    return storeMetaAPI.getStores().then((stores) => stores.length > 0);
};

export const StackDialog: React.FC<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isStackDialogVisible);

    // I think this is essentially a useBehavior, but don't got time to figure out how to do it that way
    const [storeConnected, setStoreConnected] = useState(false);
    checkForStores().then(setStoreConnected);

    const [showDashboardEdit, setDashboardEdit] = useState(false);
    const [showStackEdit, setStackEdit] = useState(false);
    const [showAddDashboard, setAddDashboard] = useState(false);
    const [dashboardToBeEdited, setDashboardToBeEdited] = useState<DashboardDTO | null>(null);
    const [stackToBeEdited, setStackToBeEdited] = useState<StackDTO | null>(null);
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

    useEffect(() => {
        getCurrentDash();
    }, [dashboards]);

    function fetchData() {
        setStacksLoading(true);
        setDashLoading(true);
        fetchUserDashboardsAndStacks(setDashboards, setStacks, setDashLoading, setStacksLoading);
    }

    function getCurrentDash() {
        const dash = dashboardStore.currentDashboard().value;
        if (!dash) return null;
        const currentDash = dashboards.find((d) => d.guid === dash.state().value.guid);
        if (!currentDash) return null;
        if (currentDash.stack) {
            setCurrentStack(currentDash.stack);
        }
    }

    function notOnlyDefaultDashboardInStack(stack: StackDTO) {
        const numOfDashboards = dashboards.filter((dashboard) =>
            dashboard.stack ? dashboard.stack.id === stack.id : false
        ).length;

        const hasDefaultDashboard: boolean = dashboards
            .filter((dashboard) => (dashboard.stack ? dashboard.stack.id === stack.id : false))
            .some((dashboard) => dashboard.name === stack.name + " (default)");

        return numOfDashboards > 1 || (!hasDefaultDashboard && numOfDashboards > 0);
    }

    const addNewDashboardToStack = async (stack: StackDTO) => {
        setStackToBeEdited(stack);
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
        if (!dashboard.publishedToStore) {
            restoreUnsharedDashboard();
        } else {
            confirmRestoreDashboard(dashboard);
        }
    };

    const showEditDashboardDialog = async (dashboard: DashboardDTO) => {
        setDashboardToBeEdited(dashboard);
        setDashboardEdit(true);
    };

    const showEditStackDialog = async (stack: StackDTO) => {
        setStackToBeEdited(stack);
        setStackEdit(true);
    };

    const onDashboardEditSubmitted = (dashboard: DashboardDTO) => {
        setDashboardEdit(false);
        fetchData();
        dashboardStore.fetchUserDashboards(dashboard.guid);
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
    const onDeleteStackConfirmed = async (stack: StackDTO) => {
        const response = await stackApi.deleteStackAsAdmin(stack.id);
        if (response.status !== 200) return false;

        fetchData();
        return true;
    };

    const confirmDashboardDelete = async (dashboard: DashboardDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: dashboard.name, style: "bold" }, "."],
            onConfirm: () => onDeleteDashboardConfirmed(dashboard)
        });
    };
    const onDeleteDashboardConfirmed = async (dashboard: DashboardDTO) => {
        const response = await dashboardApi.deleteDashboard(dashboard.guid);
        if (response.status !== 200) return false;

        fetchData();
        return true;
    };

    const shareOrPush = async (stack: StackDTO) => {
        if (storeConnected) {
            confirmPush(stack);
        } else {
            confirmShare(stack);
        }
    };

    const confirmPush = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Push stack to store",
            message: [
                "You are uploading this Stack to a Store.",
                "\n",
                "If you have access to more than one Store, you will be prompted to choose."
            ],
            onConfirm: () => storeExportService.uploadStack(stack.id)
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

    const onShareConfirmed = async (stack: StackDTO) => {
        const response = await stackApi.shareStack(stack.id);
        if (response.status !== 200) return false;

        fetchData();
        return true;
    };

    const confirmRestoreDashboard = async (dashboard: DashboardDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "You are discarding all changes made to ",
                { text: dashboard.name, style: "bold" },
                " and restoring its default setting. Press OK to confirm."
            ],
            onConfirm: () => onRestoreDashboardConfirmed(dashboard)
        });
    };
    const onRestoreDashboardConfirmed = async (dashboard: DashboardDTO) => {
        const response = await dashboardApi.restoreDashboard(dashboard);
        if (response.status !== 200) return false;

        await dashboardStore.fetchUserDashboards(dashboard.guid);
        mainStore.hideStackDialog();
        return true;
    };

    const restoreUnsharedDashboard = async () => {
        showConfirmationDialog({
            title: "Warning",
            message: ["Dashboards cannot be restored until they are shared."],
            hideCancel: true
        });
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
                                    const firstDash = dashboards.find((dashboard) =>
                                        dashboard.stack ? dashboard.stack.id === stack.id : false
                                    );
                                    const stackNode: ITreeNode = {
                                        id: firstDash ? firstDash.guid : "_NoDash_" + uuid(), // since this must be unique
                                        // @ts-ignore
                                        key: stack.stackContext, // ignore that 'key' technically isn't part of ITreeNode
                                        hasCaret: notOnlyDefaultDashboardInStack(stack),
                                        label: stack.name,
                                        icon: "control",
                                        isExpanded:
                                            notOnlyDefaultDashboardInStack(stack) &&
                                            (currentStack ? currentStack.id === stack.id : false),
                                        secondaryLabel: (
                                            <ButtonGroup
                                                data-element-id={"stack-actions"}
                                                data-role={"stack-actions"}
                                                data-name={stack.name}
                                            >
                                                <Divider />
                                                <CompactAddButton
                                                    itemName="Add New Dashboard"
                                                    onClick={(event) => {
                                                        // don't let the click activate the tree node
                                                        event.stopPropagation();
                                                        addNewDashboardToStack(stack);
                                                    }}
                                                />
                                                <Divider />
                                                <CompactShareButton
                                                    itemName={
                                                        // sorry about the nesting
                                                        firstDash === undefined
                                                            ? "Can't " +
                                                              (storeConnected ? "push" : "share") +
                                                              " an empty stack."
                                                            : storeConnected
                                                            ? "Push Stack To Store"
                                                            : "Share Stack"
                                                        // stack.approved // TODO? fix approval. Ignore for now.
                                                        // ? "Share Stack"
                                                        // : "Only Approved Stacks Can Be Shared"
                                                    }
                                                    // disabled={!stack.approved && !storeConnected} // This don't work.
                                                    onClick={(event) => {
                                                        // don't let the click activate the tree node
                                                        event.stopPropagation();
                                                        shareOrPush(stack);
                                                    }}
                                                    disabled={firstDash === undefined}
                                                />
                                                <Divider />
                                                <CompactRestoreButton
                                                    itemName="Restore Stack"
                                                    onClick={(event) => {
                                                        // don't let the click activate the tree node
                                                        event.stopPropagation();
                                                        restoreStack(stack);
                                                    }}
                                                />
                                                <Divider />
                                                <CompactEditButton
                                                    itemName="Edit Stack"
                                                    onClick={(event) => {
                                                        // don't let the click activate the tree node
                                                        event.stopPropagation();
                                                        showEditStackDialog(stack);
                                                    }}
                                                />
                                                <Divider />
                                                <CompactDeleteButton
                                                    itemName="Delete Stack"
                                                    onClick={(event) => {
                                                        // don't let the click activate the tree node
                                                        event.stopPropagation();
                                                        confirmStackDelete(stack);
                                                    }}
                                                />
                                                <Divider />
                                            </ButtonGroup>
                                        ),
                                        childNodes: dashboards
                                            .filter((dashboard) =>
                                                dashboard.stack ? dashboard.stack.id === stack.id : false
                                            )
                                            .map((dashboard) => {
                                                const dashNode: ITreeNode = {
                                                    id: dashboard.guid,
                                                    // @ts-ignore
                                                    key: dashboard.guid, // ignore that 'key' technically isn't part of ITreeNode
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
                                                                onClick={(event) => {
                                                                    // don't let the click activate the tree node
                                                                    event.stopPropagation();
                                                                    restoreDashboard(dashboard);
                                                                }}
                                                            />
                                                            <Divider />
                                                            <CompactEditButton
                                                                itemName="Edit Dashboard"
                                                                onClick={(event) => {
                                                                    // don't let the click activate the tree node
                                                                    event.stopPropagation();
                                                                    showEditDashboardDialog(dashboard);
                                                                }}
                                                            />
                                                            <Divider />
                                                            <CompactDeleteButton
                                                                itemName="Delete Dashboard"
                                                                onClick={(event) => {
                                                                    // don't let the click activate the tree node
                                                                    event.stopPropagation();
                                                                    confirmDashboardDelete(dashboard);
                                                                }}
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
            {showDashboardEdit && dashboardToBeEdited && (
                <Dialog
                    className={themeClass}
                    isOpen={showDashboardEdit}
                    onClose={() => setDashboardEdit(false)}
                    title="Edit Dashboard"
                >
                    <div data-element-id="EditDashboardDialog" className={Classes.DIALOG_BODY}>
                        <EditDashboardForm
                            dashboard={dashboardToBeEdited}
                            onSubmit={() => onDashboardEditSubmitted(dashboardToBeEdited)}
                        />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
            {showStackEdit && stackToBeEdited && (
                <Dialog
                    className={themeClass}
                    isOpen={showStackEdit}
                    onClose={() => setStackEdit(false)}
                    title="Edit Stack"
                >
                    <div data-element-id="EditStackDialog" className={Classes.DIALOG_BODY}>
                        <EditStackForm stack={stackToBeEdited} onSubmit={onStackEditSubmitted} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
            {showAddDashboard && stackToBeEdited && (
                <Dialog
                    className={themeClass}
                    isOpen={showAddDashboard}
                    onClose={() => setAddDashboard(false)}
                    title="Create New Dashboard"
                >
                    <div data-element-id="CreateDashboardDialog" className={Classes.DIALOG_BODY}>
                        <CreateDashboardForm stackId={stackToBeEdited.id} onSubmit={onAddNewDashboardSubmitted} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>
                </Dialog>
            )}
        </div>
    );
};
