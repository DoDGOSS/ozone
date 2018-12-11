import * as React from "react";

import { Alert, Button, ButtonGroup, Divider, Intent } from "@blueprintjs/core";
import { AdminTable } from "../../table/AdminTable";

import { WidgetContainer } from "../../../widget-dashboard/WidgetContainer";
import { UserCreateForm } from "./UserCreateForm";

import { lazyInject } from "../../../../inject";
import { UserAPI, UserCreateRequest, UserDTO } from "../../../../api";


export interface State {
    users: UserDTO[];
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showCreate: boolean;
    alertIsOpen: boolean;
    deleteUser?: any;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Popup warning dialogue for deleting
// Error handling for form (if username exists etc)

export class UsersWidget extends React.Component<{}, State> {

    @lazyInject(UserAPI)
    private userAPI: UserAPI;

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            pageSize: 5,
            showTable: true,
            showCreate: false,
            alertIsOpen: false,
            columns: [
                {
                    Header: "Users",
                    columns: [
                        {
                            Header: "Name",
                            accessor: "userRealName",
                            Footer: (
                                // TODO - Keep in footer or move to below table
                                <Button
                                    text="Create"
                                    intent={Intent.SUCCESS}
                                    icon="add"
                                    small={true}
                                    onClick={() => this.toggleCreate()}
                                    data-element-id='user-admin-widget-create-button'
                                />
                            )
                        },
                        {
                            Header: "Email",
                            accessor: "email"
                        },
                        {
                            Header: "Groups",
                            accessor: "totalGroups"
                        },
                        {
                            Header: "Widgets",
                            accessor: "totalWidgets"
                        },
                        {
                            Header: "Dashboards",
                            accessor: "totalDashboards"
                        },
                        {
                            Header: "Last Login",
                            accessor: "lastLogin"
                        }
                    ],

                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => (
                        <div>
                            <ButtonGroup>
                                <Button
                                    text="Edit"
                                    intent={Intent.PRIMARY}
                                    icon="edit"
                                    small={true}
                                    onClick={() => this.getUserById(row.original.id)}
                                />
                                <Divider/>
                                <Button
                                    text="Delete"
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    onClick={() => this.handleAlertOpen(row.original)}
                                    data-element-id={"user-admin-widget-delete-" + row.original.email}
                                />
                            </ButtonGroup>
                        </div>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        const title = 'User Admin Widget';
        const showTable = this.state.showTable;
        const showCreate = this.state.showCreate;

        return (
            <WidgetContainer
                title={title}
                data-instance="user-admin"
                body={
                    <div
                        data-element-id="user-admin-widget-dialog">
                        {showTable &&
                        <AdminTable
                            data={this.state.users}
                            columns={this.state.columns}
                            loading={this.state.loading}
                            pageSize={this.state.pageSize}
                        />
                        }
                        {showCreate &&
                        // TODO - Create class
                        <div style={{ margin: 40 }}>
                            <UserCreateForm createUser={this.createUser}/>
                            <Button
                                text="Back"
                                intent={Intent.SUCCESS}
                                icon="undo"
                                small={true}
                                onClick={this.toggleCreate}
                            />
                        </div>
                        }

                        { this.state.alertIsOpen && (
                            <Alert cancelButtonText="Cancel"
                                   confirmButtonText="Delete User"
                                   icon="trash"
                                   intent={Intent.DANGER}
                                   isOpen={this.state.alertIsOpen}
                                   className="delete-user-alert"
                                   onCancel={this.handleAlertCancel}
                                   onConfirm={() => this.handleAlertConfirm(this.state.deleteUser.id)}>
                                <p>Are you sure you want to delete <br/><b>User: {this.state.deleteUser.userRealName}</b>?</p>
                            </Alert>
                        )}

                    </div>
                }
            />
        );
    }

    private handleAlertOpen = (deleteUser: any) => this.setState({ alertIsOpen: true, deleteUser });

    private handleAlertCancel = () => this.setState({ alertIsOpen: false, deleteUser: undefined });

    // pass in function to delete
    private handleAlertConfirm = (id: number) => {
        this.deleteUserById(id);
        this.setState({ alertIsOpen: false, deleteUser: undefined });
    };

    private toggleCreate = () => {
        this.setState({
            showCreate: !this.state.showCreate,
            showTable: !this.state.showTable
        });
    }

    private getUsers = async () => {
        const response = await this.userAPI.getUsers();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            users: response.data.data,
            loading: false
        });
    }

    private getUserById = async (id: number) => {
        const response = await this.userAPI.getUserById(id);
        console.log(response);

        // TODO: Handle failed request
        if (response.status !== 200) return;
    }

    private createUser = async (data: UserCreateRequest) => {
        const response = await this.userAPI.createUser(data);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.toggleCreate();
        this.setState({ loading: true });
        this.getUsers();

        return true;
    }

    private deleteUserById = async (id: number) => {
        const response = await this.userAPI.deleteUser(id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getUsers();

        return true;
    }

}
