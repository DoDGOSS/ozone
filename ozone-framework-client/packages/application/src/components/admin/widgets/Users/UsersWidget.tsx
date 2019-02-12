import * as styles from '../Widgets.scss';

import * as React from "react";
import {Button, ButtonGroup, Divider, InputGroup, Intent} from "@blueprintjs/core";

import { lazyInject } from "../../../../inject";
import { UserAPI, UserCreateRequest, UserDTO } from "../../../../api";

import { AdminTable } from "../../table/AdminTable";

import { UserCreateForm } from "./UserCreateForm";
import { ConfirmationDialog } from '../../../confirmation-dialog/ConfirmationDialog';
import { UserEditTabGroup } from "../Groups/UserEditTabGroup";


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
    EDIT,
}

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
            showEditUser: false,
            showDelete: false,
            confirmationMessage: '',
            manageUser: undefined,

            columns: [
                {
                    Header: "Users",
                    columns: [
                        { Header: "Name",       accessor: "userRealName" },
                        { Header: "Username",   accessor: "username" },
                        { Header: "Email",      accessor: "email" },
                        { Header: "Groups",     accessor: "totalGroups" },
                        { Header: "Widgets",    accessor: "totalWidgets" },
                        { Header: "Dashboards", accessor: "totalDashboards" },
                        { Header: "Last Login", accessor: "lastLogin" }
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
                                        this.showSubSection(UserWidgetSubSection.EDIT),
                                        this.setState({updatingUser: row.original})
                                    )}
                                    data-element-id={"user-admin-widget-edit-" + row.original.email}
                                />
                                <Divider/>
                                <Button
                                    data-element-id={"user-admin-widget-delete-" + row.original.email}
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

                {showTable &&
                <div className={styles.actionBar}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        value={this.state.filter}
                        onChange={(e: any) => this.setState({filter: e.target.value})}
                        data-element-id="search-field"
                    />
                </div>
                }

                {showTable &&
                <div className={styles.table}>
                    <AdminTable
                        data={data}
                        columns={this.state.columns}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>                
                }
                
                {showTable &&
                <div className={styles.buttonBar}>
                    <Button
                        text="Create"
                        onClick={() => this.showSubSection(UserWidgetSubSection.CREATE)}
                        data-element-id='user-admin-widget-create-button'
                    />
                </div>
                }

                {showCreate &&
                <UserCreateForm
                    onSubmit={this.createUser}
                    onCancel={() => {this.showSubSection(UserWidgetSubSection.TABLE);}}
                    />
                }


                {showEditUser &&
                <UserEditTabGroup
                    user={this.state.updatingUser}
                    onUpdate={this.handleUpdate}
                    onBack={() => {this.showSubSection(UserWidgetSubSection.TABLE);}}
                />
                }

<               ConfirmationDialog
                    show={this.state.showDelete}
                    title='Warning'
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageUser} />

                {/* {this.state.alertIsOpen && (
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
                )} */}
            </div>
        );
    }

    private showSubSection(subSection: UserWidgetSubSection) {
        this.setState({
            showTable: subSection === UserWidgetSubSection.TABLE,
            showCreate: subSection === UserWidgetSubSection.CREATE,
            showEditUser: subSection === UserWidgetSubSection.EDIT,
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
    };

    private handleUpdate(update?: any) {
        this.getUsers();
    }

    private createUser = async (data: UserCreateRequest) => {
        const response = await this.userAPI.createUser(data);

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
            confirmationMessage: `This action will permenantly delete <strong>${user.username}</strong>`,
            manageUser: user
        });

        this.getUsers();

        return true;
    }

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageUser: undefined,
        });

        const user: UserDTO = payload;

        const response = await this.userAPI.deleteUser(user.id);
    
        // TODO: Handle failed request
        if (response.status !== 200) return false;
    
        this.getUsers();
    
        return true;

    }

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageUser: undefined,
        });
    }}
