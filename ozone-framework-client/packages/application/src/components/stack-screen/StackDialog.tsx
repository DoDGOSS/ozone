import React, { useEffect, useState } from "react";
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
import { dashboardStore } from "../../stores/DashboardStore";

import { dashboardApi } from "../../api/clients/DashboardAPI";
import { stackApi } from "../../api/clients/StackAPI";
import { storeMetaAPI } from "../../api/clients/StoreMetaAPI";

import { storeExportService } from "../../services/StoreExportService";

import { showConfirmationDialog } from "../confirmation-dialog/showConfirmationDialog";
import { EditDashboardForm } from "../create-dashboard-screen/EditDashboardForm";

import { DashboardDTO } from "../../api/models/DashboardDTO";
import { StackDTO } from "../../api/models/StackDTO";
import { GenericTree } from "../generic-tree/GenericTree";
import { CreateDashboardForm } from "../create-dashboard-screen/CreateDashboardForm";
import { EditStackForm } from "../create-stack-screen/EditStackForm";
import { userDashboardApi } from "../../api/clients/UserDashboardAPI";
import { UserDashboardsGetResponse } from "../../api/models/UserDashboardDTO";

import { uuid } from "../../utility";
import { authService } from "../../services/AuthService";
import { AuthUserDTO } from "../../api/models/AuthUserDTO";
import { Widget } from "../../models/Widget";
import { showToast } from "../toaster/Toaster";
import { showStoreSelectionDialog } from "../confirmation-dialog/showStoreSelectionDialog";
import { ListOf, Response } from "../../api/interfaces";
import { Dashboard } from "../../models/Dashboard";

// TODO - iconImageUrl not saving to database`

const fetchUserDashboardsAndStacks = async (
    dispatchCurrentUserResult: (currentUser: AuthUserDTO) => void,
    dispatchDashboardResult: (dashboards: DashboardDTO[]) => void,
    dispatchStackResult: (stacks: StackDTO[]) => void,
    dispatchDashboardState: (dashLoading: boolean) => void,
    dispatchStackState: (stackLoading: boolean) => void
) => {
    authService.check().then((authcheckResponse: any) => {
        dispatchCurrentUserResult(authcheckResponse.data);
    });
    stackApi.getStacks().then((userStacksResponse: Response<ListOf<StackDTO[]>>) => {
        const stacks = userStacksResponse.data.data;
        dispatchStackResult(stacks);
        dispatchStackState(false);
    });
    userDashboardApi.getOwnDashboards().then((ownDashboardResponse: Response<UserDashboardsGetResponse>) => {
        if (!(ownDashboardResponse.status >= 200 && ownDashboardResponse.status < 400)) return;
        const userDashboards = (ownDashboardResponse.data.dashboards as unknown) as DashboardDTO[];
        dispatchDashboardResult(userDashboards);
        dispatchDashboardState(false);
    });
};

const fetchStores = async (
    dispatchStoresResult: (stores: Widget[]) => void,
    dispatchStoreConnectedResult: (storeConnected: boolean) => void
) => {
    const retrievedStores: Widget[] = await storeMetaAPI.getStores();
    dispatchStoresResult(retrievedStores);
    dispatchStoreConnectedResult(retrievedStores.length > 0);
};

export const StackDialog: React.FC<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isStackDialogVisible);
    const [storeConnected, setStoreConnected] = useState(false);
    const [stores, setStores] = useState<Widget[] | null>(null);
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
    const [currentUser, setCurrentUser] = useState<AuthUserDTO | null>(null);

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
        fetchUserDashboardsAndStacks(setCurrentUser, setDashboards, setStacks, setDashLoading, setStacksLoading);
        fetchStores(setStores, setStoreConnected);
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
            .some((dashboard) => dashboard.name === stack.name || dashboard.name === stack.name + " (default)");

        return numOfDashboards > 1 || (!hasDefaultDashboard && numOfDashboards > 0);
    }

    function userDoesNotOwnStack(stack: StackDTO): boolean {
        const loggedInUsername: string | undefined = currentUser ? currentUser.username : undefined;
        const stackOwner: string | undefined = stack.owner ? stack.owner.username : undefined;
        return loggedInUsername !== undefined && stackOwner !== undefined && loggedInUsername !== stackOwner;
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
        if (stack.approved === false) {
            restoreUnsharedStack();
        } else {
            confirmRestoreStack(stack);
        }
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
        let response;
        try {
            if (currentUser && currentUser.isAdmin) {
                response = await stackApi.deleteStackAsAdmin(stack.id);
            } else {
                response = await stackApi.deleteStackAsUser(stack.id);
            }

            if (!(response.status >= 200 && response.status < 400)) return false;
        } catch (e) {
            fetchData();
            return false;
        }

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
        const response = await dashboardApi.deleteDashboard(dashboard);
        if (!(response.status >= 200 && response.status < 400)) return false;

        dashboardStore.fetchUserDashboards();
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
        if (stores != null) {
            showStoreSelectionDialog({
                stores: stores,
                onConfirm: (store: Widget) => {
                    storeExportService.uploadStack(stack.id, store);
                    try {
                        onShareConfirmed(stack);
                    } catch (e) {
                        showToast({
                            message: "Error Pushing Stack to Store!",
                            intent: Intent.DANGER
                        });
                        return;
                    }
                },
                onCancel: () => {
                    return;
                }
            });
        } else {
            showToast({
                message: "No Stores Connected!",
                intent: Intent.DANGER
            });

            return new Promise(() => {
                return;
            });
        }
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
        try {
            const response = await stackApi.shareStack(stack.id);
            if (!(response.status >= 200 && response.status < 400)) return false;
        } catch (e) {
            fetchData();
            console.log("Error in sharing stack");
            return false;
        }

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

    const confirmRestoreStack = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "You are discarding all changes made to ",
                { text: stack.name, style: "bold" },
                " and restoring it's default setting. Press OK to confirm."
            ],
            onConfirm: () => onRestoreStackConfirmed(stack)
        });
    };

    const onRestoreDashboardConfirmed = async (dashboard: DashboardDTO) => {
        const response = await dashboardApi.restoreDashboard(dashboard);
        if (!(response.status >= 200 && response.status < 400)) return false;
        dashboardStore.fetchUserDashboards(dashboard.guid);
        mainStore.hideStackDialog();
        return true;
    };

    const onRestoreStackConfirmed = async (stack: StackDTO) => {
        const response = await stackApi.restoreStack(stack.id);
        if (!(response.status >= 200 && response.status < 400)) return false;
        dashboardStore.fetchUserDashboards();
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

    const restoreUnsharedStack = async () => {
        showConfirmationDialog({
            title: "Warning",
            message: ["Stacks cannot be restored until they are shared."],
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
                                    const userDoesNotOwn: boolean = userDoesNotOwnStack(stack);
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
                                            <div onClick={(event) => event.stopPropagation()}>
                                                <ButtonGroup
                                                    data-element-id={"stack-actions"}
                                                    data-role={"stack-actions"}
                                                    data-name={stack.name}
                                                >
                                                    <Divider />
                                                    <CompactAddButton
                                                        itemName={
                                                            userDoesNotOwn
                                                                ? "Can't edit a stack you do not own.  Owner is listed as: " +
                                                                  stack.owner!.username +
                                                                  "."
                                                                : "Add New Dashboard"
                                                        }
                                                        onClick={(event) => {
                                                            // don't let the click activate the tree node
                                                            event.stopPropagation();
                                                            addNewDashboardToStack(stack);
                                                        }}
                                                        disabled={userDoesNotOwn}
                                                    />
                                                    <Divider />
                                                    <CompactShareButton
                                                        itemName={
                                                            // sorry about the nesting
                                                            userDoesNotOwn
                                                                ? "Can't " +
                                                                  (storeConnected ? "push" : "share") +
                                                                  " a stack you do not own.  Owner is listed as: " +
                                                                  stack.owner!.username +
                                                                  "."
                                                                : firstDash === undefined
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
                                                        disabled={firstDash === undefined || userDoesNotOwn}
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
                                                        itemName={
                                                            userDoesNotOwn
                                                                ? "Can't edit a stack you do not own.  Owner is listed as: " +
                                                                  stack.owner!.username +
                                                                  "."
                                                                : "Edit Stack"
                                                        }
                                                        onClick={(event) => {
                                                            // don't let the click activate the tree node
                                                            event.stopPropagation();
                                                            showEditStackDialog(stack);
                                                        }}
                                                        disabled={userDoesNotOwn}
                                                    />
                                                    <Divider />
                                                    <CompactDeleteButton
                                                        itemName={
                                                            userDoesNotOwn
                                                                ? "Can't delete a stack you do not own.  Owner is listed as: " +
                                                                  stack.owner!.username +
                                                                  "."
                                                                : "Delete Stack"
                                                        }
                                                        onClick={(event) => {
                                                            // don't let the click activate the tree node
                                                            event.stopPropagation();
                                                            confirmStackDelete(stack);
                                                        }}
                                                        disabled={userDoesNotOwn}
                                                    />
                                                    <Divider />
                                                </ButtonGroup>
                                            </div>
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
                                                        <div onClick={(event) => event.stopPropagation()}>
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
                                                        </div>
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
