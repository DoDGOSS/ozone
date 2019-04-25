import * as React from "react";
import ReactTable, { Column } from "react-table";
import { Button, ButtonGroup, Intent, MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import * as styles from "../../Widgets.scss";

import { CancelButton, CheckBox, FormError, HiddenField, SubmitButton, TextField } from "../../../../form";
import { showConfirmationDialog } from "../../../../confirmation-dialog/InPlaceConfirmationDialog";
import { groupApi } from "../../../../../api/clients/GroupAPI";

import { Group } from "../../../../../models/Group";
import { GroupDTO } from "../../../../../api/models/GroupDTO";
import { groupFromJson } from "../../../../../codecs/Group.codec";
import { GenericTable } from "../../../table/GenericTable";
import { GroupsDialog } from "./GroupsDialog";

interface State {
    loading: boolean;
    widgetGroups: Group[];
    allGroups: Group[];
    dialogOpen: boolean;
}

interface Props {
    widget: any;
    addGroups: (groups: Group[]) => Promise<boolean>;
    removeGroup: (group: Group) => Promise<boolean>;
}

export class GroupsPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            widgetGroups: [],
            allGroups: [],
            dialogOpen: false
        };
    }

    componentDidMount() {
        this.getAllGroups();
        this.getWidgetGroups();
    }

    getAllGroups = async () => {
        const response = await groupApi.getGroups();
        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            allGroups: this.parseGroupDTOs(response.data.data)
        });
    };

    getWidgetGroups = async () => {
        const response = await groupApi.getGroupsForWidget(this.props.widget.id);
        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgetGroups: this.parseGroupDTOs(response.data.data),
            loading: false
        });
    };

    parseGroupDTOs(groupDTOs: GroupDTO[]): Group[] {
        const groups: Group[] = [];
        if (groupDTOs) {
            for (const u of groupDTOs) {
                groups.push(groupFromJson(u));
            }
        }
        return groups;
    }

    render() {
        let dialog = null;
        if (this.state.dialogOpen) {
            dialog = this.getGroupDialog();
        }
        return (
            <div>
                {dialog}
                {this.getGroupTable()}
                <Button text="Add" onClick={() => this.openDialog()} />
            </div>
        );
    }

    getGroupDialog() {
        return (
            <GroupsDialog
                isOpen={this.state.dialogOpen}
                onClose={() => this.closeDialog()}
                onSubmit={(selections: Group[]) => this.addSelectedGroups(selections)}
                allGroups={this.state.allGroups}
            />
        );
    }

    getGroupTable() {
        return (
            <GenericTable
                items={this.state.widgetGroups}
                getColumns={() => [
                    { Header: "Name", id: "name", accessor: (group: Group) => group.name },
                    { Header: "Description", id: "description", accessor: (group: Group) => group.description },
                    { Header: "Remove", Cell: this.rowActionButtons }
                ]}
            />
        );
    }

    rowActionButtons = (row: { original: Group }) => {
        return (
            <div>
                <ButtonGroup>
                    <Button
                        data-element-id="widget-admin-group-remove-button"
                        data-widget-title={row.original.name}
                        text={"Remove"}
                        intent={Intent.DANGER}
                        icon="trash"
                        small={true}
                        onClick={() => this.confirmAndDeleteGroup(row.original)}
                    />
                </ButtonGroup>
            </div>
        );
    };

    confirmAndDeleteGroup(groupToRemove: Group): void {
        showConfirmationDialog({
            title: "Warning",
            message:
                "This action will permenantly remove " +
                groupToRemove.name +
                " from the widget " +
                this.props.widget.displayName,
            onConfirm: () => this.removeGroupAndSave(groupToRemove)
        });
    }

    removeGroupAndSave(groupToRemove: Group): void {
        this.props.removeGroup(groupToRemove).then(() => this.getWidgetGroups());
    }

    openDialog(): void {
        this.getAllGroups().then(() =>
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

    addSelectedGroups(newSelections: Group[]): void {
        const groupList: Group[] = [];
        for (const newGroup of newSelections) {
            if (this.state.widgetGroups.findIndex((u) => newGroup.id === u.id) !== -1) {
                continue;
            }
            groupList.push(newGroup);
        }

        if (groupList.length > 0) {
            this.props.addGroups(groupList).then(() => this.getWidgetGroups());
        }
    }
}
