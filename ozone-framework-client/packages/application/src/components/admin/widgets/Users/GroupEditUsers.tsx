import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";
import { GroupEditUsersDialog } from "./GroupEditUsersDialog";

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";

import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";

import { userApi, UserQueryCriteria } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";

interface GroupEditUsersProps {
    onUpdate: (update?: any) => void;
    group: any;
}

export interface GroupEditUsersState {
    users: UserDTO[];
    filtered: UserDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    group: any;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageUser: UserDTO | undefined;
}

export class GroupEditUsers extends React.Component<GroupEditUsersProps, GroupEditUsersState> {
    private static readonly SELECT_USERS_COLUMN_DEFINITION = [
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
        }
    ];

    private readonly USERS_COLUMN_DEFINITION = [
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
        {
            Header: "Actions",
            Cell: (row: any) => (
                <div>
                    <ButtonGroup>
                        <Button
                            data-element-id="group-admin-widget-delete-user-button"
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

    constructor(props: GroupEditUsersProps) {
        super(props);
        this.state = {
            users: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            group: this.props.group,
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
            <div data-element-id="group-admin-add-user">
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
                        data-element-id="group-edit-add-user-dialog-add-button"
                    />
                </div>

                <GroupEditUsersDialog
                    show={this.state.showAdd}
                    title="Add User(s) to Group"
                    confirmHandler={this.handleAddUserResponse}
                    cancelHandler={this.handleAddUserCancel}
                    columns={GroupEditUsers.SELECT_USERS_COLUMN_DEFINITION}
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
        const currentGroup: GroupDTO = this.state.group;

        const criteria: UserQueryCriteria = {
            group_id: currentGroup.id
        };

        const response = await userApi.getUsers(criteria);

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            users: response.data.data,
            loading: false
        });
    };

    private handleAddUserResponse = async (users: Array<UserDTO>) => {
        const request: GroupUpdateRequest = {
            id: this.state.group.id,
            name: this.state.group.name,
            update_action: "add",
            user_ids: users.map((user: UserDTO) => user.id)
        };

        const response = await groupApi.updateGroup(request);

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
        const currentGroup: GroupDTO = this.state.group;

        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${
                user.userRealName
            }</strong> from the group <strong>${currentGroup.name}</strong>`,
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

        const request: GroupUpdateRequest = {
            id: this.state.group.id,
            name: this.state.group.name,
            update_action: "remove",
            user_ids: [user.id]
        };

        const response = await groupApi.updateGroup(request);

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
