import * as React from "react";
import ReactTable, { Column } from "react-table";
import { Button, MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import * as styles from "../Widgets.scss";

import { userApi } from "../../../../api/clients/UserAPI";
import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { CancelButton, CheckBox, FormError, HiddenField, SubmitButton, TextField } from "../../../form";

import { User } from "../../../../models/User";
import { UserDTO } from "../../../../api/models/UserDTO";
import { userFromJson } from "../../../../codecs/User.codec";
import { GenericTable } from "../../table/GenericTable";
import { UsersDialog } from "./UsersDialog";

interface State {
    loading: boolean;
    widgetUsers: User[];
    allUsers: User[];
    selectedUser: User | undefined;
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
            dialogOpen: false,
            selectedUser: undefined
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
                {this.actionButtons()}
            </div>
        );
    }

    getUserDialog() {
        return (
            <UsersDialog
                isOpen={this.state.dialogOpen}
                onClose={this.closeDialog}
                onSubmit={this.onFormSubmit}
                allUsers={this.state.allUsers}
            />
        );
    }

    getUserTable() {
        return (
            <GenericTable
                title={this.props.widget ? this.props.widget.displayName : "Users"}
                items={this.state.widgetUsers}
                getColumns={() => [
                    { Header: "Full Name", id: "userRealName", accessor: (user: User) => user.username },
                    { Header: "Last Sign In", id: "lastLogin", accessor: (user: User) => user.lastLogin }
                ]}
                onSelect={(selected: User) => {
                    this.setState({
                        selectedUser: selected
                    });
                }}
            />
        );
    }

    actionButtons(): any {
        return (
            <div>
                <Button text="Add" onClick={this.openDialog} />
                <Button
                    text="Remove"
                    disabled={this.state.selectedUser === undefined}
                    onClick={this.removeUserAndSave}
                />
            </div>
        );
    }

    removeUserAndSave = (): void => {
        if (this.state.selectedUser) {
            this.removeUser(this.state.selectedUser);
            this.props.removeUser(this.state.selectedUser);
            this.deselectUser();
        }
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

    onFormSubmit = (newUser: any): void => {
        if (this.state.widgetUsers.findIndex((u) => newUser.id === u.id) !== -1) {
            return;
        }

        this.addUser(newUser);
        // allow for potential multiple selection later
        this.props.addUsers([newUser]);
        // this.getWidgetUsers();
    };

    deselectUser(): void {
        this.setState({
            selectedUser: undefined
        });
    }

    addUser(newUser: User): void {
        const userList = [];
        for (const u of this.state.widgetUsers) {
            userList.push(u);
        }
        if (this.state.widgetUsers.findIndex((u) => newUser.id === u.id) < 0) {
            userList.push(newUser);
        }
        this.setState({
            widgetUsers: userList
        });
    }

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
