import * as React from "react";
import { Button, ButtonGroup, Divider, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";

import { UserCreateForm } from "./UserCreateForm";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { UserEditTabs } from "./UserEditTabs";

import { UserCreateRequest, UserDTO } from "../../../../api/models/UserDTO";
import { userApi } from "../../../../api/clients/UserAPI";

import * as styles from "../Widgets.scss";

export interface State {
    users: UserDTO[];
    filtered: UserDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showCreate: boolean;
    showEditUser: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageUser: UserDTO | undefined;
    updatingUser?: any;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Error handling for form (if username exists etc)

enum UserWidgetSubSection {
    TABLE,
    CREATE,
    EDIT
}

export class UsersWidget extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            showTable: true,
            showCreate: false,
            showEditUser: false,
            showDelete: false,
            confirmationMessage: "",
            manageUser: undefined,

            columns: [
                {
                    Header: "Users",
                    columns: [
                        { Header: "Name", accessor: "userRealName" },
                        { Header: "Username", accessor: "username" },
                        { Header: "Email", accessor: "email" },
                        { Header: "Groups", accessor: "totalGroups" },
                        { Header: "Widgets", accessor: "totalWidgets" },
                        { Header: "Dashboards", accessor: "totalDashboards" },
                        { Header: "Last Login", accessor: "lastLogin" }
                    ]
                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => {
                        const user: UserDTO = row.original;
                        return (
                            <ButtonGroup data-role={"user-admin-widget-actions"} data-username={user.username}>
                                <Button
                                    text="Edit"
                                    intent={Intent.PRIMARY}
                                    icon="edit"
                                    small={true}
                                    onClick={() => {
                                        this.showSubSection(UserWidgetSubSection.EDIT);
                                        this.setState({ updatingUser: user });
                                    }}
                                    data-element-id={"user-admin-widget-edit-button"}
                                />
                                <Divider />
                                <Button
                                    data-element-id={"user-admin-widget-delete-button"}
                                    text="Delete"
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    onClick={() => this.deleteUser(user)}
                                />
                            </ButtonGroup>
                        );
                    }
                }
            ]
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        const showTable = this.state.showTable;
        const showCreate = this.state.showCreate;
        const showEditUser = this.state.showEditUser;

        let data = this.state.users;
        const filter = this.state.filter.toLowerCase();

        // TODO - Improve this - this will be slow if there are many users. Add pagination
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
            <div data-element-id="user-admin-widget-dialog">
                {showTable && (
                    <>
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
                                columns={this.state.columns}
                                loading={this.state.loading}
                                pageSize={this.state.pageSize}
                            />
                        </div>
                        <div className={styles.buttonBar}>
                            <Button
                                text="Create"
                                onClick={() => this.showSubSection(UserWidgetSubSection.CREATE)}
                                data-element-id="user-admin-widget-create-button"
                            />
                        </div>
                    </>
                )}

                {showCreate && (
                    <UserCreateForm
                        onSubmit={this.createUser}
                        onCancel={() => {
                            this.showSubSection(UserWidgetSubSection.TABLE);
                        }}
                    />
                )}

                {showEditUser && (
                    <UserEditTabs
                        user={this.state.updatingUser}
                        onUpdate={this.handleUpdate}
                        onBack={() => {
                            this.showSubSection(UserWidgetSubSection.TABLE);
                        }}
                        data-element-id="user-admin-widget-edit-view"
                    />
                )}

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

    private showSubSection(subSection: UserWidgetSubSection) {
        this.setState({
            showTable: subSection === UserWidgetSubSection.TABLE,
            showCreate: subSection === UserWidgetSubSection.CREATE,
            showEditUser: subSection === UserWidgetSubSection.EDIT
        });
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

    private handleUpdate(update?: any) {
        this.getUsers();
    }

    private createUser = async (data: UserCreateRequest) => {
        const response = await userApi.createUser(data);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.showSubSection(UserWidgetSubSection.TABLE);
        this.setState({ loading: true });
        this.getUsers();

        return true;
    };

    // private updateUser = async (data: UserUpdateRequest) => {
    //     console.log('Submitting updated user');
    //     const response = await this.userAPI.updateUser(data);

    //     if (response.status !== 200) return false;

    //     this.toggleUpdate();
    //     this.setState({ loading: true });
    //     this.getUsers();

    //     return true;
    // }

    private deleteUser = async (user: UserDTO) => {
        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${user.username}</strong>`,
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

        const response = await userApi.deleteUser(user.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getUsers();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageUser: undefined
        });
    };
}
