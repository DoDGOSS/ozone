import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { DeleteButton } from "../../table/TableButtons";
import { AdminTable } from "../../table/AdminTable";
import { UserGroupsEditDialog } from "./UserGroupsEditDialog";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";
import { UserDTO } from "../../../../api/models/UserDTO";
import { groupApi, GroupQueryCriteria } from "../../../../api/clients/GroupAPI";

interface UserEditGroupsProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditGroupsState {
    groups: GroupDTO[];
    filtered: GroupDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageGroup: GroupDTO | undefined;
}

export class UserGroupsPanel extends React.Component<UserEditGroupsProps, UserEditGroupsState> {
    private static readonly SELECT_GROUPS_COLUMN_DEFINITION = [
        {
            Header: "Groups",
            columns: [
                { Header: "Group Name", accessor: "name" },
                { Header: "Users", accessor: "totalUsers" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Dashboards", accessor: "totalDashboards" }
            ]
        }
    ];
    private readonly GROUPS_COLUMN_DEFINITION = [
        {
            Header: "Groups",
            columns: [
                { Header: "Group Name", accessor: "name" },
                { Header: "Users", accessor: "totalUsers" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Dashboards", accessor: "totalDashboards" }
            ]
        },
        {
            Header: "Actions",
            Cell: (row: any) => (
                <div>
                    <ButtonGroup>
                        <DeleteButton onClick={() => this.deleteGroup(row.original)} />
                    </ButtonGroup>
                </div>
            )
        }
    ];

    constructor(props: UserEditGroupsProps) {
        super(props);
        this.state = {
            groups: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            showAdd: false,
            showDelete: false,
            confirmationMessage: "",
            manageGroup: undefined
        };
    }

    componentDidMount() {
        this.getGroups();
    }

    render() {
        let data = this.state.groups;
        const filter = this.state.filter.toLowerCase();

        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter((row) => {
                return row.name.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="group-admin-widget-dialog">
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
                        columns={this.GROUPS_COLUMN_DEFINITION}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="group-edit-add-group-dialog-add-button"
                    />
                </div>

                <UserGroupsEditDialog
                    show={this.state.showAdd}
                    title="Add Group(s) to User"
                    confirmHandler={this.handleAddGroupResponse}
                    cancelHandler={this.handleAddGroupCancel}
                    columns={UserGroupsPanel.SELECT_GROUPS_COLUMN_DEFINITION}
                />

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageGroup}
                />
            </div>
        );
    }

    private toggleShowAdd() {
        this.setState({
            showAdd: true
        });
    }

    private getGroups = async () => {
        const currentUser: UserDTO = this.props.user;

        const criteria: GroupQueryCriteria = {
            user_id: currentUser.id
        };

        const response = await groupApi.getGroups(criteria);

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            groups: response.data.data,
            loading: false
        });
    };

    private handleAddGroupResponse = async (groups: Array<GroupDTO>) => {
        // const responses = await Promise.all(groups.map( async (group: GroupDTO) => {
        const responses = [];
        for (const group of groups) {
            const request: GroupUpdateRequest = {
                id: group.id,
                name: group.name,
                update_action: "add",
                user_ids: [this.props.user.id]
            };

            const response = await groupApi.updateGroup(request);

            if (response.status !== 200) return;

            responses.push(response.data.data);
        }

        this.setState({
            showAdd: false
        });

        this.getGroups();
        this.props.onUpdate(responses);

        return responses;
    };

    private handleAddGroupCancel = () => {
        this.setState({
            showAdd: false
        });
    };

    private deleteGroup = async (group: GroupDTO) => {
        const currentUser: UserDTO = this.props.user;

        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${
                group.displayName
            }</strong> from the user <strong>${currentUser.userRealName}</strong>`,
            manageGroup: group
        });

        this.getGroups();

        return true;
    };

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined
        });

        const group: GroupDTO = payload;

        const request: GroupUpdateRequest = {
            id: group.id,
            name: group.name,
            update_action: "remove",
            user_ids: [this.props.user.id]
        };

        const response = await groupApi.updateGroup(request);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getGroups();
        this.props.onUpdate();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined
        });
    };
}
