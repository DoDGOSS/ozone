import * as React from "react";
import {Alert, Button, ButtonGroup, Divider, InputGroup, Intent} from "@blueprintjs/core";

import { lazyInject } from "../../../../inject";
import { UserAPI, UserCreateRequest, UserDTO, UserUpdateRequest } from "../../../../api";

import { AdminTable } from "../../table/AdminTable";

import { UserCreateForm } from "./UserCreateForm";
import { UserEditForm } from "./UserEditForm";


export interface State {
    users: UserDTO[];
    filtered: UserDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showCreate: boolean;
    showUpdate: boolean;
    alertIsOpen: boolean;
    updatingUser?: any;
    deleteUser?: any;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Error handling for form (if username exists etc)

export class UsersWidget extends React.Component<{}, State> {

    @lazyInject(UserAPI)
    private userAPI: UserAPI;

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            filtered: [],
            filter: '',
            loading: true,
            pageSize: 5,
            showTable: true,
            showCreate: false,
            showUpdate: false,
            alertIsOpen: false,
            columns: [
                {
                    Header: "Users",
                    columns: [
                        {
                            Header: "Name",
                            accessor: "userRealName",
                            // filterable: true,
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
                            Header: "Username",
                            accessor: "username"
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
                                    onClick={() => (
                                        this.toggleUpdate(),
                                            this.setState({updatingUser: row.original})
                                    )}
                                    data-element-id={"user-admin-widget-edit-" + row.original.email}
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
        const showTable = this.state.showTable;
        const showCreate = this.state.showCreate;
        const showUpdate = this.state.showUpdate;
        let data = this.state.users;
        const filter = this.state.filter.toLowerCase();


        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter(row => {
                return row.userRealName.toLowerCase().includes(filter) ||
                    row.email.toLowerCase().includes(filter) ||
                    row.username.toLowerCase().includes(filter);
            });
        }

        return (

            <div data-element-id="user-admin-widget-dialog">

                <InputGroup
                    placeholder="Search..."
                    leftIcon="search"
                    value={this.state.filter}
                    onChange={(e: any) => this.setState({filter: e.target.value})}
                    data-element-id="search-field"
                />

                {showTable &&
                <AdminTable
                    data={data}
                    columns={this.state.columns}
                    loading={this.state.loading}
                    pageSize={this.state.pageSize}
                />
                }
                {showCreate &&
                <UserCreateForm onSubmit={this.createUser}
                                onCancel={this.toggleCreate}/>
                }
                {showUpdate &&
                // TODO - Create class
                // TODO Consolidate into one form
                <UserEditForm onSubmit={this.updateUser}
                              onCancel={this.toggleUpdate}
                              user={this.state.updatingUser}/>

                }

                {this.state.alertIsOpen && (
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
    };

    private toggleUpdate = () => {
        this.setState({
            showUpdate: !this.state.showUpdate,
            showTable: !this.state.showTable
        });
    };

    private getUsers = async () => {
        const response = await this.userAPI.getUsers();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            users: response.data.data,
            loading: false
        });
    };

    private createUser = async (data: UserCreateRequest) => {
        const response = await this.userAPI.createUser(data);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.toggleCreate();
        this.setState({ loading: true });
        this.getUsers();

        return true;
    };

    private updateUser = async (data: UserUpdateRequest) => {
        console.log('Submitting updated user');
        const response = await this.userAPI.updateUser(data);

        if (response.status !== 200) return false;

        this.toggleUpdate();
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
