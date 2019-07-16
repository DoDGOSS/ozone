import * as React from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";

import { showConfirmationDialog } from "../../../../confirmation-dialog/InPlaceConfirmationDialog";

import { userApi } from "../../../../../api/clients/UserAPI";
import { widgetApi } from "../../../../../api/clients/WidgetAPI";

import { User } from "../../../../../models/User";
import { UserDTO } from "../../../../../api/models/UserDTO";
import { WidgetDTO } from "../../../../../api/models/WidgetDTO";
import { userFromJson } from "../../../../../codecs/User.codec";
import { ColumnTabulator, GenericTable } from "../../../../generic-table/GenericTable";
import { DeleteButton } from "../../../../generic-table/TableButtons";
import { UsersDialog } from "./UsersDialog";

interface Props {
    widget: WidgetDTO;
    onUpdate: () => void;
}

interface State {
    loading: boolean;
    widgetUsers: User[];
    allUsers: User[];
    dialogOpen: boolean;
}

export class UsersPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            widgetUsers: [],
            allUsers: [],
            dialogOpen: false
        };
    }

    componentDidMount() {
        this.getAllUsers();
        this.getWidgetUsers();
    }

    getAllUsers = async () => {
        const response = await userApi.getUsers();
        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            allUsers: this.parseUserDTOs(response.data.data)
        });
    };

    getWidgetUsers = async () => {
        const response = await userApi.getUsersForWidget(this.props.widget.id);
        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgetUsers: this.parseUserDTOs(response.data.data),
            loading: false
        });
    };

    parseUserDTOs(userDTOs: UserDTO[]): User[] {
        const users: User[] = [];
        if (userDTOs) {
            for (const u of userDTOs) {
                users.push(userFromJson(u));
            }
        }
        return users;
    }

    render() {
        let dialog = null;
        if (this.state.dialogOpen) {
            dialog = this.getUserDialog();
        }
        return (
            <div>
                {dialog}
                {this.getUserTable()}
                <Button text="Add" onClick={() => this.openDialog()} />
            </div>
        );
    }

    getUserDialog() {
        return (
            <UsersDialog
                isOpen={this.state.dialogOpen}
                onClose={() => this.closeDialog()}
                onSubmit={(selections: User[]) => this.addSelectedUsers(selections)}
                allUsers={this.state.allUsers}
            />
        );
    }

    openDialog(): void {
        this.getAllUsers().then(() =>
            this.setState({
                dialogOpen: true
            })
        );
    }

    closeDialog(): void {
        this.setState({
            dialogOpen: false
        });
    }

    getUserTable() {
        return (
            <GenericTable
                items={this.state.widgetUsers}
                getColumns={() =>
                    [
                        { title: "Full Name", field: "displayName" },
                        { title: "Last Sign In", field: "lastLogin" },
                        { title: "Actions", width: 90, responsive: 0, formatter: this.rowActionButtons }
                    ] as ColumnTabulator[]
                }
            />
        );
    }

    rowActionButtons = (row: any) => {
        const data: User = row.cell._cell.row.data;
        return (
            <div>
                <ButtonGroup>
                    <DeleteButton onClick={() => this.confirmAndDeleteUser(data)} itemName={data.displayName} />
                </ButtonGroup>
            </div>
        );
    };

    confirmAndDeleteUser(userToRemove: User): void {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: userToRemove.displayName, style: "bold" },
                " from widget ",
                { text: this.props.widget.value.namespace, style: "bold" }
            ],
            onConfirm: () => this.removeUserAndRefresh(userToRemove)
        });
    }

    removeUserAndRefresh(userToRemove: User): void {
        this.removeUser(userToRemove).then(() => this.getWidgetUsers());
        this.props.onUpdate();
    }

    async removeUser(user: User): Promise<boolean> {
        if (this.props.widget === undefined) {
            return false;
        }
        const response = await widgetApi.removeWidgetUsers(this.props.widget.id, user.id);
        // TODO: Handle failed request
        if (response.status !== 200) return false;
        return true;
    }

    addSelectedUsers(newSelections: User[]): void {
        const userList: User[] = [];
        for (const newUser of newSelections) {
            if (this.state.widgetUsers.findIndex((u) => newUser.id === u.id) !== -1) {
                continue;
            }
            userList.push(newUser);
        }

        if (userList.length > 0) {
            this.addUsers(userList).then(() => this.getWidgetUsers());
            this.props.onUpdate();
        }
    }

    async addUsers(users: User[]): Promise<boolean> {
        if (this.props.widget === undefined) {
            return false;
        }
        const userIds: number[] = [];
        for (const u of users) {
            userIds.push(u.id);
        }
        const response = await widgetApi.addWidgetUsers(this.props.widget.id, userIds);
        // TODO: Handle failed request
        if (response.status !== 200) return false;
        return true;
    }
}
