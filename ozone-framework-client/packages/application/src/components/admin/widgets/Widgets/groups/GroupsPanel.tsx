import * as React from "react";
import { Button, ButtonGroup, Intent } from "@blueprintjs/core";

import { showConfirmationDialog } from "../../../../confirmation-dialog/InPlaceConfirmationDialog";
import { groupApi } from "../../../../../api/clients/GroupAPI";
import { widgetApi } from "../../../../../api/clients/WidgetAPI";

import { Group } from "../../../../../models/Group";
import { GroupDTO } from "../../../../../api/models/GroupDTO";
import { groupFromJson } from "../../../../../codecs/Group.codec";
import { WidgetDTO } from "../../../../../api/models/WidgetDTO";
import { GenericTable } from "../../../../generic-table/GenericTable";
import { GroupsDialog } from "./GroupsDialog";

interface State {
    loading: boolean;
    widgetGroups: Group[];
    allGroups: Group[];
    dialogOpen: boolean;
}

interface Props {
    widget: WidgetDTO;
    onUpdate: () => void;
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

    addSelectedGroups(newSelections: Group[]): void {
        const groupList: Group[] = [];
        for (const newGroup of newSelections) {
            if (this.state.widgetGroups.findIndex((u) => newGroup.id === u.id) !== -1) {
                continue;
            }
            groupList.push(newGroup);
        }

        if (groupList.length > 0) {
            this.addGroups(groupList).then(() => this.getWidgetGroups());
            this.props.onUpdate();
        }
    }

    async addGroups(groups: Group[]): Promise<boolean> {
        if (this.props.widget === undefined) {
            return false;
        }
        const groupIds: number[] = [];
        for (const g of groups) {
            groupIds.push(g.id);
        }
        const response = await widgetApi.addWidgetGroups(this.props.widget.id, groupIds);
        // TODO: Handle failed request
        if (response.status !== 200) return false;
        return true;
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
                    {
                        Header: "Remove",
                        Cell: (row: { original: Group }) => (
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
                        )
                    }
                ]}
            />
        );
    }

    confirmAndDeleteGroup(groupToRemove: Group): void {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: groupToRemove.name, style: "bold" },
                " from widget ",
                { text: this.props.widget.value.namespace, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeGroupAndRefresh(groupToRemove)
        });
    }

    removeGroupAndRefresh(groupToRemove: Group): void {
        this.removeGroup(groupToRemove).then(() => this.getWidgetGroups());
        this.props.onUpdate();
    }

    async removeGroup(group: Group): Promise<boolean> {
        if (this.props.widget === undefined) {
            return false;
        }
        const response = await widgetApi.removeWidgetGroups(this.props.widget.id, group.id);
        // TODO: Handle failed request
        if (response.status !== 200) return false;
        return true;
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
}
