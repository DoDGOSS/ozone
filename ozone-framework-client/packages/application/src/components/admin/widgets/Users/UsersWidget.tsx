import * as React from "react";
import { Button, ButtonGroup, Divider } from "@blueprintjs/core";

import { GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { UserSetup } from "./UserSetup";

import { UserDTO } from "../../../../api/models/UserDTO";
import { userApi } from "../../../../api/clients/UserAPI";

import * as styles from "../Widgets.scss";

export interface State {
    users: UserDTO[];
    loading: boolean;
    showTable: boolean;
    showSetup: boolean;
    updatingUser: UserDTO | undefined;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Error handling for form (if username exists etc)

enum UserWidgetSubSection {
    TABLE,
    SETUP
}

export class UsersWidget extends React.Component<{}, State> {
    defaultPageSize: number = 5;

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            showTable: true,
            showSetup: false,
            updatingUser: undefined
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        const showTable = this.state.showTable;
        const showSetup = this.state.showSetup;

        return (
            <div data-element-id="user-admin-widget-dialog">
                {showTable && (
                    <>
                        <GenericTable
                            title={"Users"}
                            items={this.state.users}
                            getColumns={() => this.getTableColumns()}
                            reactTableProps={{
                                loading: this.state.loading,
                                defaultPageSize: this.defaultPageSize
                            }}
                        />
                        <div className={styles.buttonBar}>
                            <Button
                                text="Create"
                                onClick={() => this.createNewUser()}
                                data-element-id="user-admin-widget-create-button"
                            />
                        </div>
                    </>
                )}

                {showSetup && (
                    <UserSetup
                        user={this.state.updatingUser}
                        onUpdate={this.handleUpdate}
                        onBack={() => {
                            this.handleUpdate();
                            this.showSubSection(UserWidgetSubSection.TABLE);
                        }}
                        data-element-id="user-admin-widget-edit-view"
                    />
                )}
            </div>
        );
    }

    private getTableColumns(): any[] {
        return [
            { Header: "Name", id: "userRealName", accessor: (u: UserDTO) => u.userRealName },
            { Header: "Username", id: "username", accessor: (u: UserDTO) => u.username },
            { Header: "Email", id: "email", accessor: (u: UserDTO) => u.email },
            { Header: "Groups", id: "totalGroups", accessor: (u: UserDTO) => u.totalGroups },
            { Header: "Widgets", id: "totalWidgets", accessor: (u: UserDTO) => u.totalWidgets },
            { Header: "Dashboards", id: "totalDashboards", accessor: (u: UserDTO) => u.totalDashboards },
            { Header: "Last Login", id: "lastLogin", accessor: (u: UserDTO) => u.lastLogin },
            {
                Header: "Actions",
                sortable: false,
                Cell: (row: { original: UserDTO }) => {
                    const user: UserDTO = row.original;
                    return (
                        // TODO - Abstract this to only have to provide onclick function name with styled buttons
                        <ButtonGroup data-role={"user-admin-widget-actions"} data-username={user.username}>
                            <EditButton
                                onClick={() => {
                                    this.setState({ updatingUser: user });
                                    this.showSubSection(UserWidgetSubSection.SETUP);
                                }}
                            />
                            <Divider />
                            <DeleteButton onClick={() => this.confirmDeleteUser(user)} />
                        </ButtonGroup>
                    );
                }
            }
        ];
    }

    private showSubSection(subSection: UserWidgetSubSection) {
        this.setState({
            showTable: subSection === UserWidgetSubSection.TABLE,
            showSetup: subSection === UserWidgetSubSection.SETUP
        });
    }

    private handleUpdate(update?: any) {
        this.getUsers();
    }

    private getUsers = async () => {
        const response = await userApi.getUsers();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            users: response.data.data,
            loading: false
        });
    };

    private createNewUser(): void {
        this.setState({ updatingUser: undefined });
        this.showSubSection(UserWidgetSubSection.SETUP);
    }

    private confirmDeleteUser = async (user: UserDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: user.username, style: "bold" }, "."],
            onConfirm: () => this.deleteUser(user)
        });

        return true;
    };

    private deleteUser = async (user: UserDTO) => {
        const response = await userApi.deleteUser(user.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;
        this.getUsers();
        return true;
    };
}
