import * as React from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";

import { StackGroupsEditDialog } from "./StackGroupsEditDialog";
import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { GroupDTO } from "../../../../api/models/GroupDTO";
import { stackApi } from "../../../../api/clients/StackAPI";

import * as styles from "../Widgets.scss";

interface StackEditGroupsProps {
    onUpdate: (update?: any) => void;
    stack: any;
}

export interface StackEditGroupsState {
    groups: GroupDTO[];
    loading: boolean;
    showGroupsDialog: boolean;
}

// TODO It should close regardless. Apply fix to stackapi that was applied to
export class StackGroupsPanel extends React.Component<StackEditGroupsProps, StackEditGroupsState> {
    constructor(props: StackEditGroupsProps) {
        super(props);
        this.state = {
            groups: this.props.stack.groups,
            loading: true,
            showGroupsDialog: false
        };
    }

    componentDidMount() {
        this.getStackGroups();
    }

    render() {
        return (
            <div data-element-id="group-admin-widget-dialog">
                <GenericTable
                    items={this.state.groups}
                    getColumns={() => this.getTableColumns()}
                    tableProps={{
                        loading: this.state.loading
                    }}
                />
                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        disabled={!this.props.stack.approved}
                        title={
                            this.props.stack.approved ? undefined : "Groups can only be added to Stacks shared by Owner"
                        }
                        onClick={() => this.showAddGroupsDialog()}
                        data-element-id="group-edit-add-group-dialog-add-button"
                    />
                </div>

                <StackGroupsEditDialog
                    show={this.state.showGroupsDialog}
                    onSubmit={this.addGroups}
                    onClose={this.closeGroupsDialog}
                />
            </div>
        );
    }

    private getTableColumns(): ColumnTabulator[] {
        return [
            { title: "Group Name", field: "name" },
            { title: "Users", field: "totalUsers" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Dashboards", field: "totalDashboards" },
            {
                title: "Actions",
                width: 90,
                formatter: (row: any) => {
                    const data: GroupDTO = row.cell._cell.row.data;
                    return (
                        <div>
                            <ButtonGroup data-role="dashboard-admin-widget-group-actions" data-groupname={data.name}>
                                <DeleteButton onClick={() => this.confirmRemoveUser(data)} />
                            </ButtonGroup>
                        </div>
                    );
                }
            }
        ] as ColumnTabulator[];
    }

    private showAddGroupsDialog() {
        this.setState({
            showGroupsDialog: true
        });
    }

    private getStackGroups() {
        this.setState({
            loading: true
        });
        stackApi.getStackById(this.props.stack.id).then((response) => {
            this.setState({
                loading: false,
                groups: response.data.data[0].groups
            });
        });
    }

    private addGroups = async (groups: Array<GroupDTO>) => {
        const response = await stackApi.addStackGroups(this.props.stack.id, groups);
        if (response.status !== 200) {
            return;
        }

        this.setState({
            showGroupsDialog: false
        });

        this.getStackGroups();
    };

    private closeGroupsDialog = () => {
        this.setState({
            showGroupsDialog: false
        });
    };

    private confirmRemoveUser = async (group: GroupDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: group.displayName, style: "bold" },
                " from ",
                { text: this.props.stack.name, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeGroup(group)
        });
    };

    private removeGroup = async (group: GroupDTO) => {
        stackApi.removeStackGroups(this.props.stack.id, [group]).then(() => this.getStackGroups());
    };
}
