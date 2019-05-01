import * as React from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";

import { GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";
import { StackUsersEditDialog } from "./StackUsersEditDialog";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO, StackUpdateRequest } from "../../../../api/models/StackDTO";

import { userApi } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";

import * as styles from "../Widgets.scss";

interface StackEditUsersProps {
    onUpdate: (update?: any) => void;
    stack: StackDTO;
}

export interface StackEditUsersState {
    users: UserDTO[];
    loading: boolean;
    showUsersDialog: boolean;
}

export class StackUsersPanel extends React.Component<StackEditUsersProps, StackEditUsersState> {
    constructor(props: StackEditUsersProps) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            showUsersDialog: false
        };
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        return (
            <div data-element-id="dashboard-admin-add-user">
                <GenericTable
                    items={this.state.users}
                    getColumns={() => this.getTableColumns()}
                    reactTableProps={{
                        loading: this.state.loading
                    }}
                />
                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.showAddUsersDialog()}
                        data-element-id="dashboard-edit-add-user-dialog-add-button"
                    />
                </div>

                <StackUsersEditDialog
                    show={this.state.showUsersDialog}
                    onSubmit={this.addUsers}
                    onClose={this.closeAddUsersDialog}
                />
            </div>
        );
    }

    private getTableColumns() {
        return [
            { Header: "Name", id: "name", accessor: (user: UserDTO) => user.userRealName },
            { Header: "Username", id: "username", accessor: (user: UserDTO) => user.username },
            { Header: "Email", id: "email", accessor: (user: UserDTO) => user.email },
            { Header: "Stacks", id: "totalStacks", accessor: (user: UserDTO) => user.totalStacks },
            { Header: "Widgets", id: "totalWidgets", accessor: (user: UserDTO) => user.totalWidgets },
            { Header: "Dashboards", id: "totalDashboards", accessor: (user: UserDTO) => user.totalDashboards },
            { Header: "Last Login", id: "lastLogin", accessor: (user: UserDTO) => user.lastLogin },
            {
                Header: "Actions",
                Cell: (row: { original: UserDTO }) => (
                    <div>
                        <ButtonGroup>
                            <DeleteButton onClick={() => this.confirmRemoveUser(row.original)} />
                        </ButtonGroup>
                    </div>
                )
            }
        ];
    }

    private showAddUsersDialog() {
        this.setState({
            showUsersDialog: true
        });
    }

    private getUsers = async () => {
        const currentStack: StackDTO = this.props.stack;

        const response = await userApi.getUsers();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            users: response.data.data,
            loading: false
        });
    };

    private addUsers = async (users: Array<UserDTO>) => {
        const request: StackUpdateRequest = {
            name: this.props.stack.name,
            id: this.props.stack.id,
            stackContext: this.props.stack.stackContext
        };

        const response = await stackApi.updateStack(request);

        if (response.status !== 200) return;

        this.setState({
            showUsersDialog: false
        });

        this.getUsers();
        this.props.onUpdate();
    };

    private closeAddUsersDialog = () => {
        this.setState({
            showUsersDialog: false
        });
    };

    private confirmRemoveUser = async (user: UserDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: user.userRealName, style: "bold" },
                " from ",
                { text: this.props.stack.name, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeUser(user)
        });
        return true;
    };

    private removeUser = async (user: UserDTO) => {
        const request: StackUpdateRequest = {
            name: this.props.stack.name,
            id: this.props.stack.id,
            stackContext: this.props.stack.stackContext
        };

        const response = await stackApi.updateStack(request);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getUsers();
        this.props.onUpdate();

        return true;
    };
}
