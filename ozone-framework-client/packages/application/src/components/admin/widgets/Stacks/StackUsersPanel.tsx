import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, Intent, Position, Toaster } from "@blueprintjs/core";

import { GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";
import { StackUsersEditDialog } from "./StackUsersEditDialog";
import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { UserDTO } from "../../../../api/models/UserDTO";
import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";
import { userApi, UserQueryCriteria } from "../../../../api/clients/UserAPI";
import { ColumnTabulator } from "../../../generic-table/GenericTable";

interface StackEditUsersProps {
    onUpdate: (update?: any) => void;
    stack: StackDTO;
}

export interface StackEditUsersState {
    users: UserDTO[];
    loading: boolean;
    showAdd: boolean;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export class StackUsersPanel extends React.Component<StackEditUsersProps, StackEditUsersState> {
    constructor(props: StackEditUsersProps) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            showAdd: false
        };
    }

    componentDidMount() {
        this.getStackUsers();
    }

    render() {
        return (
            <div data-element-id="user-admin-widget-dialog">
                <GenericTable
                    items={this.state.users}
                    getColumns={() => this.getTableColumns()}
                    tableProps={{
                        loading: this.state.loading
                    }}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        disabled={!this.props.stack.approved}
                        title={
                            this.props.stack.approved
                                ? undefined
                                : "Users can only be added to Dashboards shared by Owner"
                        }
                        onClick={() => this.showAddUserDialog()}
                        data-element-id="user-edit-add-user-dialog-add-button"
                    />
                </div>

                {/* <StackUsersEditDialog
                    show={this.state.showAdd}
                    onSubmit={this.addUser}
                    onClose={this.closeUsersDialog}
                /> */}
            </div>
        );
    }

    private showAddUserDialog() {
        this.setState({
            showAdd: true
        });
    }

    private getStackUsers() {
        this.setState({
            loading: true
        });
        stackApi.getStackById(this.props.stack.id).then((stackResponse) => {
            const updatedStack = stackResponse.data.data[0];

            const criteria: UserQueryCriteria = {
                group_id: updatedStack.defaultGroup.id
            };

            userApi.getUsers(criteria).then((userResponse) => {
                // TODO: Handle failed request
                if (userResponse.status !== 200) return;

                this.setState({
                    loading: false,
                    users: userResponse.data.data
                });
            });
        });
    }

    private addUser = async (users: Array<UserDTO>) => {
        const response = await stackApi.addStackUsers(this.props.stack.id, users);
        if (response.status === 200) {
            OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
        } else {
            OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
        }

        this.setState({
            showAdd: false
        });

        this.getStackUsers();
    };

    private closeUsersDialog = () => {
        this.setState({
            showAdd: false
        });
    };

    private confirmDeleteUser = async (user: UserDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: user.userRealName, style: "bold" },
                " from the dashboard ",
                { text: this.props.stack.name, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeUser(user)
        });
    };

    private removeUser = async (user: UserDTO) => {
        stackApi.removeStackUsers(this.props.stack.id, [user]).then(() => this.getStackUsers());
    };

    private getTableColumns() {
        return [
            { title: "Name", field: "userRealName" },
            { title: "Username", field: "username" },
            { title: "Email", field: "email" },
            { title: "Stacks", field: "totalStacks" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Dashboards", field: "totalDashboards" },
            { title: "Last Login", field: "lastLogin" },
            {
                title: "Actions",
                width: 90,
                responsive: 0,
                formatter: (row: any) => {
                    const data: UserDTO = row.cell._cell.row.data;
                    return (
                        <div>
                            <ButtonGroup data-role="stack-admin-widget-user-actions" data-username={data.username}>
                                <DeleteButton
                                    onClick={() => this.confirmDeleteUser(data)}
                                    itemName={data.userRealName}
                                />
                            </ButtonGroup>
                        </div>
                    );
                }
            }
        ] as ColumnTabulator[];
    }
}
