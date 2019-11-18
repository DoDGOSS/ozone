import * as React from "react";
import { Button, ButtonGroup, Divider } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";

import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
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
    _isMounted: boolean = false;

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
        this._isMounted = true;
        this.getUsers();
    }

    componentWillUnmount() {
        this._isMounted = false;
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
                            tableProps={{
                                loading: this.state.loading,
                                paginationSize: this.defaultPageSize
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

    private getTableColumns(): ColumnTabulator[] {
        return [
            { title: "Name", field: "userRealName" },
            { title: "Username", field: "username" },
            { title: "Email", field: "email" },
            { title: "Groups", field: "totalGroups" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Dashboards", field: "totalDashboards" },
            { title: "Last Login", field: "lastLogin" },
            {
                title: "Actions",
                width: 180,
                responsive: 0,
                formatter: (row: any) => {
                    const user: UserDTO = row.cell._cell.row.data;
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
        ] as ColumnTabulator[];
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
        if (!(response.status >= 200 && response.status < 400)) return;

        if (!this._isMounted) {
            return;
        }

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
        if (!(response.status >= 200 && response.status < 400)) return false;
        this.getUsers();
        return true;
    };
}
