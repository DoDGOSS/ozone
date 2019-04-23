import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";
import { StackUsersEditDialog } from "./StackUsersEditDialog";

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO, StackUpdateRequest } from "../../../../api/models/StackDTO";

import { userApi, UserQueryCriteria } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";

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
    stack: any;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageUser: UserDTO | undefined;
}

export class StackUsersPanel extends React.Component<StackEditUsersProps, StackEditUsersState> {
    private static readonly SELECT_USERS_COLUMN_DEFINITION = [
        {
            Header: "Users",
            columns: [
                { Header: "Name", accessor: "userRealName" },
                { Header: "Username", accessor: "username" },
                { Header: "Email", accessor: "email" },
                { Header: "Stacks", accessor: "totalStacks" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Dashboards", accessor: "totalDashboards" },
                { Header: "Last Login", accessor: "lastLogin" }
            ]
        }
    ];

    private readonly USERS_COLUMN_DEFINITION = [
        {
            Header: "Users",
            columns: [
                { Header: "Name", accessor: "userRealName" },
                { Header: "Username", accessor: "username" },
                { Header: "Email", accessor: "email" },
                { Header: "Stacks", accessor: "totalStacks" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Dashboards", accessor: "totalDashboards" },
                { Header: "Last Login", accessor: "lastLogin" }
            ]
        },
        {
            Header: "Actions",
            Cell: (row: any) => (
                <div>
                    <ButtonGroup>
                        <Button
                            data-element-id="dashboard-admin-widget-delete-user-button"
                            text="Delete"
                            intent={Intent.DANGER}
                            icon="trash"
                            small={true}
                            onClick={() => this.deleteUser(row.original)}
                        />
                    </ButtonGroup>
                </div>
            )
        }
    ];

    constructor(props: StackEditUsersProps) {
        super(props);
        this.state = {
            users: [],
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
        this.getUsers();
    }

    render() {
        let data = this.state.users;
        const filter = this.state.filter.toLowerCase();

        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter((row) => {
                return (
                    row.userRealName.toLowerCase().includes(filter) ||
                    row.email.toLowerCase().includes(filter) ||
                    row.username.toLowerCase().includes(filter)
                );
            });
        }

        return (
            <div data-element-id="dashboard-admin-add-user">
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
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="dashboard-edit-add-user-dialog-add-button"
                    />
                </div>

                <StackUsersEditDialog
                    show={this.state.showAdd}
                    title="Add User(s) to Stack"
                    confirmHandler={this.handleAddUserResponse}
                    cancelHandler={this.handleAddUserCancel}
                    columns={StackUsersPanel.SELECT_USERS_COLUMN_DEFINITION}
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

    private getUsers = async () => {
        const currentStack: StackDTO = this.state.stack;

        const response = await userApi.getUsers();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            users: response.data.data,
            loading: false
        });
    };

    private handleAddUserResponse = async (users: Array<UserDTO>) => {
        const request: StackUpdateRequest = {
            name: this.state.stack.name,
            id: this.state.stack.id,
            stackContext: this.state.stack.stackContext
        };

        const response = await stackApi.updateStack(request);

        if (response.status !== 200) return;

        this.setState({
            showAdd: false
        });

        this.getUsers();
        this.props.onUpdate(response.data.data);
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
            }</strong> from the stack <strong>${currentStack.name}</strong>`,
            manageUser: user
        });

        this.getUsers();

        return true;
    };

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageUser: undefined
        });

        const user: UserDTO = payload;

        const request: StackUpdateRequest = {
            name: this.state.stack.name,
            id: this.state.stack.id,
            stackContext: this.state.stack.stackContext
        };

        const response = await stackApi.updateStack(request);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getUsers();
        this.props.onUpdate();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageUser: undefined
        });
    };
}
