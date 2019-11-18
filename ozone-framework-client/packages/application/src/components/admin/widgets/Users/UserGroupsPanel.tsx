import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, Intent, Position, Toaster } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";
import { UserGroupsEditDialog } from "./UserGroupsEditDialog";
import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { GroupDTO } from "../../../../api/models/GroupDTO";
import { UserDTO } from "../../../../api/models/UserDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";

interface UserEditGroupsProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditGroupsState {
    groups: GroupDTO[];
    loading: boolean;
    showAdd: boolean;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

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
                    tableProps={{
                        loading: this.state.loading,
                        paginationSize: this.defaultPageSize
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

    getColumns(): ColumnTabulator[] {
        return [
            { title: "Group Name", field: "name" },
            { title: "Users", field: "totalUsers" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Dashboards", field: "totalDashboards" },
            {
                title: "Actions",
                width: 90,
                responsive: 0,
                formatter: (row: any) => {
                    const data: GroupDTO = row.cell._cell.row.data;
                    return (
                        <div>
                            <ButtonGroup>
                                <DeleteButton onClick={() => this.confirmDeleteGroup(data)} />
                            </ButtonGroup>
                        </div>
                    );
                }
            }
        ] as ColumnTabulator[];
    }

    private showAdd() {
        this.setState({
            showAdd: true
        });
    }

    // TODO - Refactor this when we refactor Client APIs
    private getGroups = async () => {
        const currentUser: UserDTO = this.props.user;
        const response = await groupApi.getGroupsForUser(currentUser.id);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return;

        this.setState({
            groups: response.data.data.map((data: any) => data.group),
            loading: false
        });
    };

    // TODO - Refactor this when we refactor Client APIs
    private addGroups = async (groups: Array<GroupDTO>) => {
        // const responses = await Promise.all(groups.map( async (group: GroupDTO) => {
        const responses = [];
        for (const group of groups) {
            if (this.state.groups.findIndex((g) => g.id === group.id) >= 0) {
                continue;
            }

            const response = await groupApi.addUsersToGroup(group, [this.props.user]);

            if (response.status >= 200 && response.status < 400) {
                OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
            } else {
                OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
                return;
            }

            responses.push(response.data);
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

    // TODO - Refactor this when we refactor Client APIs
    private removeGroup = async (group: GroupDTO) => {
        const response = await groupApi.removeUsersFromGroup(group, [this.props.user]);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return false;

        this.getGroups();
        this.props.onUpdate();

        return true;
    };
}
