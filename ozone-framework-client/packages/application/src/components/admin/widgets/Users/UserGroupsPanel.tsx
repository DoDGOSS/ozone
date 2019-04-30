import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { Column } from "react-table";

import { GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";
import { UserGroupsEditDialog } from "./UserGroupsEditDialog";
import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";
import { UserDTO } from "../../../../api/models/UserDTO";
import { groupApi, GroupQueryCriteria } from "../../../../api/clients/GroupAPI";

interface UserEditGroupsProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditGroupsState {
    groups: GroupDTO[];
    loading: boolean;
    showAdd: boolean;
}

export class UserGroupsPanel extends React.Component<UserEditGroupsProps, UserEditGroupsState> {
    defaultPageSize: number;

    constructor(props: UserEditGroupsProps) {
        super(props);
        this.state = {
            groups: [],
            loading: true,
            showAdd: false
        };
        this.defaultPageSize = 5;
    }

    componentDidMount() {
        this.getGroups();
    }

    render() {
        return (
            <div data-element-id="group-admin-widget-groups">
                <GenericTable
                    title={"Groups"}
                    items={this.state.groups}
                    getColumns={() => this.getColumns()}
                    reactTableProps={{
                        loading: this.state.loading,
                        defaultPageSize: this.defaultPageSize
                    }}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.showAdd()}
                        data-element-id="group-edit-add-group-dialog-add-button"
                    />
                </div>

                <UserGroupsEditDialog
                    show={this.state.showAdd}
                    onSubmit={this.addGroups}
                    onClose={this.closeGroupsDialog}
                />
            </div>
        );
    }

    getColumns(): Column[] {
        return [
            { Header: "Group Name", accessor: "name" },
            { Header: "Users", accessor: "totalUsers" },
            { Header: "Widgets", accessor: "totalWidgets" },
            { Header: "Dashboards", accessor: "totalDashboards" },
            {
                Header: "Actions",
                Cell: (row: { original: GroupDTO }) => (
                    <div>
                        <ButtonGroup>
                            <DeleteButton onClick={() => this.confirmDeleteGroup(row.original)} />
                        </ButtonGroup>
                    </div>
                )
            }
        ];
    }

    private showAdd() {
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

    private addGroups = async (groups: Array<GroupDTO>) => {
        // const responses = await Promise.all(groups.map( async (group: GroupDTO) => {
        const responses = [];
        for (const group of groups) {
            if (this.state.groups.findIndex((g) => g.id === group.id) >= 0) {
                continue;
            }
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

    private closeGroupsDialog = () => {
        this.setState({
            showAdd: false
        });
    };

    private confirmDeleteGroup = async (group: GroupDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: this.props.user.userRealName, style: "bold" },
                " from group ",
                { text: group.name, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeGroup(group)
        });
        return true;
    };

    private removeGroup = async (group: GroupDTO) => {
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
}
