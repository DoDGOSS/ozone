import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../../generic-table/AdminTable";
import { StackUsersEditDialog } from "./StackUsersEditDialog";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { UserDTO } from "../../../../api/models/UserDTO";
import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";
import { userApi, UserQueryCriteria } from "../../../../api/clients/UserAPI";
import { ColumnTabulator } from "../../../generic-table/GenericTable";

interface StackEditUsersProps {
    onUpdate: (update?: any) => void;
    stack: any;
}

export interface StackEditUsersState {
    users: UserDTO[];
    filtered: UserDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    stack: StackDTO;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageUser: UserDTO | undefined;
}

export class StackUsersPanel extends React.Component<StackEditUsersProps, StackEditUsersState> {
    private readonly USERS_COLUMN_DEFINITION = [
        {
            title: "Users",
            columns: [
                { title: "Name", field: "userRealName" },
                { title: "Username", field: "username" },
                { title: "Email", field: "email" },
                { title: "Stacks", field: "totalStacks" },
                { title: "Widgets", field: "totalWidgets" },
                { title: "Dashboards", field: "totalDashboards" },
                { title: "Last Login", field: "lastLogin" }
            ] as ColumnTabulator[]
        },
        {
            title: "Actions",
            width: 90,
            formatter: (row: any) => {
                const data: any = row.cell._cell.row.data;
                return (
                    <div>
                        <ButtonGroup data-role="dashboard-admin-widget-user-actions" data-username={data.username}>
                            <Button
                                data-element-id="dashboard-admin-widget-delete-user-button"
                                text="Delete"
                                intent={Intent.DANGER}
                                icon="trash"
                                small={true}
                                onClick={() => this.deleteUser(data)}
                            />
                        </ButtonGroup>
                    </div>
                );
            }
        }
    ];

    constructor(props: StackEditUsersProps) {
        super(props);
        this.state = {
            users: this.props.stack.users,
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            stack: this.props.stack,
            showAdd: false,
            showDelete: false,
            confirmationMessage: "",
            manageUser: undefined
        };
    }

    componentDidMount() {
        this.getStackUsers();
    }

    render() {
        let data = this.state.users;
        const filter = this.state.filter.toLowerCase();

        if (filter) {
            data = data.filter((row) => {
                return row.userRealName.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="user-admin-widget-dialog">
                <div className={styles.actionBar}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        value={this.state.filter}
                        onChange={(e: any) => this.setState({ filter: e.target.value })}
                        data-element-id="search-field"
                    />
                </div>

                <div className={styles.table}>
                    <AdminTable
                        data={data}
                        columns={this.USERS_COLUMN_DEFINITION}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        disabled={!this.state.stack.approved}
                        title={
                            this.state.stack.approved
                                ? undefined
                                : "Users can only be added to Dashboards shared by Owner"
                        }
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="user-edit-add-user-dialog-add-button"
                    />
                </div>

                <StackUsersEditDialog
                    show={this.state.showAdd}
                    onSubmit={this.handleAddUserResponse}
                    onClose={this.handleAddUserCancel}
                />

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageUser}
                />
            </div>
        );
    }

    private toggleShowAdd() {
        this.setState({
            showAdd: true
        });
    }

    private getStackUsers() {
        this.setState({
            loading: true
        });
        stackApi.getStackById(this.state.stack.id).then((stackResponse) => {
            const updatedStack = stackResponse.data.data[0];

            const criteria: UserQueryCriteria = {
                group_id: updatedStack.defaultGroup.id
            };

            userApi.getUsers(criteria).then((userResponse) => {
                // TODO: Handle failed request
                if (userResponse.status !== 200) return;

                this.setState({
                    loading: false,
                    users: userResponse.data.data,
                    stack: updatedStack
                });
            });
        });
    }

    private handleAddUserResponse = async (users: Array<UserDTO>) => {
        const response = await stackApi.addStackUsers(this.state.stack.id, users);
        if (response.status !== 200) {
            return;
        }

        this.setState({
            showAdd: false
        });

        this.getStackUsers();
    };

    private handleAddUserCancel = () => {
        this.setState({
            showAdd: false
        });
    };

    private deleteUser = async (user: UserDTO) => {
        const currentStack: StackDTO = this.state.stack;

        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${
                user.userRealName
            }</strong> from the dashboard <strong>${currentStack.name}</strong>`,
            manageUser: user
        });
    };

    private handleConfirmationConfirmDelete = async (user: UserDTO) => {
        this.setState({
            showDelete: false,
            manageUser: undefined
        });

        stackApi.removeStackUsers(this.state.stack.id, [user]).then(() => this.getStackUsers());
    };

    private handleConfirmationCancel = () => {
        this.setState({
            showDelete: false,
            manageUser: undefined
        });
    };
}
