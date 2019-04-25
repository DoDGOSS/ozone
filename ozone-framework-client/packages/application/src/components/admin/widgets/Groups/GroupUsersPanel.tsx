import * as styles from "../Widgets.scss";

import * as React from "react";
import { Column } from "react-table";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { GenericTable } from "../../table/GenericTable";
import { DeleteButton } from "../../table/TableButtons";
import { GroupUsersEditDialog } from "./GroupUsersEditDialog";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";

import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";

import { userApi, UserQueryCriteria } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";

interface GroupEditUsersProps {
    onUpdate: (update?: any) => void;
    group: GroupDTO;
}

export interface GroupEditUsersState {
    users: UserDTO[];
    loading: boolean;
    showAdd: boolean;
}

export class GroupUsersPanel extends React.Component<GroupEditUsersProps, GroupEditUsersState> {
    defaultPageSize: number = 5;

    constructor(props: GroupEditUsersProps) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            showAdd: false
        };
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        return (
            <div data-element-id="group-admin-add-user">
                <GenericTable
                    items={this.state.users}
                    getColumns={() => this.getTableColumns()}
                    reactTableProps={{
                        loading: this.state.loading,
                        pageSize: this.defaultPageSize
                    }}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.showAdd()}
                        loading={this.state.loading}
                        data-element-id="group-edit-add-user-dialog-add-button"
                    />
                </div>

                <GroupUsersEditDialog
                    show={this.state.showAdd}
                    title="Add User(s) to Group"
                    confirmHandler={this.handleAddUser}
                    cancelHandler={this.handleAddUserCancel}
                    columns={this.getDialogColumns()}
                />
            </div>
        );
    }

    private getTableColumns(): Column[] {
        return [
            { Header: "Name", accessor: "userRealName" },
            { Header: "Username", accessor: "username" },
            { Header: "Email", accessor: "email" },
            { Header: "Groups", accessor: "totalGroups" },
            { Header: "Widgets", accessor: "totalWidgets" },
            { Header: "Dashboards", accessor: "totalDashboards" },
            { Header: "Last Login", accessor: "lastLogin" },
            {
                Header: "Actions",
                Cell: (row: any) => (
                    <ButtonGroup>
                        <DeleteButton onClick={() => this.confirmRemoveUser(row.original)} />
                    </ButtonGroup>
                )
            }
        ];
    }

    private showAdd() {
        this.setState({
            showAdd: true
        });
    }

    private getUsers = async () => {
        const currentGroup: GroupDTO = this.props.group;

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

    private handleAddUser = async (users: Array<UserDTO>) => {
        const request: GroupUpdateRequest = {
            id: this.props.group.id,
            name: this.props.group.name,
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

    private confirmRemoveUser = async (user: UserDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: user.userRealName, style: "bold" },
                " from group ",
                { text: this.props.group.name, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeUser(user)
        });
    };

    private async removeUser(user: UserDTO): Promise<boolean> {
        const request: GroupUpdateRequest = {
            id: this.props.group.id,
            name: this.props.group.name,
            update_action: "remove",
            user_ids: [user.id]
        };

        const response = await groupApi.updateGroup(request);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getUsers();
        this.props.onUpdate();

        return true;
    }

    private getDialogColumns(): Column[] {
        return [
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
    }
}
