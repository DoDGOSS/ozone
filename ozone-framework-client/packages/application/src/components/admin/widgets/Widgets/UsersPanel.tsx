import * as React from "react";
import ReactTable, { Column } from "react-table";
import { Button, ButtonGroup, Intent, MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { CancelButton, CheckBox, FormError, HiddenField, SubmitButton, TextField } from "../../../form";
import { inPlaceConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import * as styles from "../Widgets.scss";

import { userApi } from "../../../../api/clients/UserAPI";

import { User } from "../../../../models/User";
import { UserDTO } from "../../../../api/models/UserDTO";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { userFromJson } from "../../../../codecs/User.codec";
import { GenericTable } from "../../table/GenericTable";
import { UsersDialog } from "./UsersDialog";

interface State {
    loading: boolean;
    widgetUsers: User[];
    allUsers: User[];
    dialogOpen: boolean;
}

interface Props {
    widget: any;
    addUsers: (users: User[]) => Promise<boolean>;
    removeUser: (user: User) => Promise<boolean>;
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
                <Button text="Add" onClick={this.openDialog} />
            </div>
        );
    }

    getUserDialog() {
        return (
            <UsersDialog
                isOpen={this.state.dialogOpen}
                onClose={this.closeDialog}
                onSubmit={this.addSelectedUsers}
                allUsers={this.state.allUsers}
            />
        );
    }

    getUserTable() {
        return (
            <GenericTable
                items={this.state.widgetUsers}
                getColumns={() => [
                    { Header: "Full Name", id: "username", accessor: (user: User) => user.username },
                    { Header: "Last Sign In", id: "lastLogin", accessor: (user: User) => user.lastLogin },
                    { Header: "Actions", Cell: this.rowActionButtons }
                ]}
            />
        );
    }

    rowActionButtons = (row: { original: User }) => {
        return (
            <div>
                <ButtonGroup>
                    <Button
                        data-element-id="widget-admin-user-remove-button"
                        data-widget-title={row.original.username}
                        text={"Remove"}
                        intent={Intent.DANGER}
                        icon="trash"
                        small={true}
                        onClick={() => this.confirmAndDeleteUser(row.original)}
                    />
                </ButtonGroup>
            </div>
        );
    };

    confirmAndDeleteUser = (userToRemove: User): void => {
        inPlaceConfirmationDialog({
            title: "Warning",
            message:
                "This action will permenantly delete " +
                userToRemove.displayName +
                " from the widget " +
                this.props.widget.displayName,
            onConfirm: () => this.removeUserAndSave(userToRemove)
        });
    };

    removeUserAndSave = (userToRemove: User): void => {
        this.removeUser(userToRemove);
        this.props.removeUser(userToRemove);
    };

    openDialog = (): void => {
        this.setState({
            dialogOpen: true
        });
    };
    closeDialog = (): void => {
        this.setState({
            dialogOpen: false
        });
    };

    addSelectedUsers = (newSelections: User[]): void => {
        const userList: User[] = [];
        for (const newUser of newSelections) {
            if (this.state.widgetUsers.findIndex((u) => newUser.id === u.id) !== -1) {
                continue;
            }
            userList.push(newUser);
        }

        if (userList.length > 0) {
            this.setState({
                widgetUsers: [...this.state.widgetUsers, ...userList]
            });
            this.props.addUsers(userList);
        }
    };

    removeUser(user: User): void {
        const userIndex = this.state.widgetUsers.findIndex((u) => user.id === u.id);
        if (userIndex >= 0) {
            this.state.widgetUsers.splice(userIndex, 1);
        }
        const userList = [];
        for (const u of this.state.widgetUsers) {
            userList.push(u);
        }
        this.setState({
            widgetUsers: userList
        });
    }
}
