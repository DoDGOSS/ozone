import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, Intent, Position, Toaster } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";
import { GroupUsersEditDialog } from "./GroupUsersEditDialog";

import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";

import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupDTO, GroupUpdateRequest, isAutoManaged } from "../../../../api/models/GroupDTO";

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

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

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
                    tableProps={{
                        loading: this.state.loading,
                        paginationSize: this.defaultPageSize
                    }}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.showAdd()}
                        loading={this.state.loading}
                        disabled={isAutoManaged(this.props.group)}
                        data-element-id="group-edit-add-user-dialog-add-button"
                    />
                </div>

                <GroupUsersEditDialog
                    show={this.state.showAdd}
                    onSubmit={this.addUsers}
                    onClose={this.closeUsersDialog}
                />
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
                width: 90,
                responsive: 0,
                formatter: (row: any) => {
                    const data: UserDTO = row.cell._cell.row.data;
                    return (
                        <ButtonGroup>
                            <DeleteButton onClick={() => this.confirmRemoveUser(data)} itemName={data.userRealName} />
                        </ButtonGroup>
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

    private getUsers = async () => {
        const response = await userApi.getUsersForGroup(this.props.group.id);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return;

        this.setState({
            users: response.data.data.map((data: any) => data.person),
            loading: false
        });
    };

    private addUsers = async (users: Array<UserDTO>) => {
        const response = await groupApi.addUsersToGroup(this.props.group, users);

        if (response.status >= 200 && response.status < 400) {
            OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
        } else {
            OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
            return;
        }

        this.setState({
            showAdd: false,
            loading: true
        });

        this.getUsers();
        this.props.onUpdate(response.data);
    };

    private closeUsersDialog = () => {
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
        const response = await groupApi.removeUsersFromGroup(this.props.group, [user]);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return false;

        this.getUsers();
        this.props.onUpdate();

        return true;
    }
}
