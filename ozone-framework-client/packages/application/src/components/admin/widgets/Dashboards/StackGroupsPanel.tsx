import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { GenericTable } from "../../../generic-table/GenericTable";

import { StackGroupsEditDialog } from "./StackGroupsEditDialog";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";
import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";
import { DashboardDTO } from "../../../../api/models/DashboardDTO";

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
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            stack: this.props.stack,
            showGroupsDialog: false,
            showDelete: false,
            confirmationMessage: "",
            manageGroup: undefined
        };
    }

    componentDidMount() {
        this.getStackGroups();
    }

    render() {
        let data = this.state.groups;
        const filter = this.state.filter.toLowerCase();

        if (filter) {
            data = data.filter((row) => {
                return row.name.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="group-admin-widget-dialog">
                <GenericTable
                    items={this.state.groups}
                    getColumns={() => this.getTableColumns()}
                    reactTableProps={{
                        loading: this.state.loading
                    }}
                />
                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        disabled={!this.state.stack.approved}
                        title={
                            this.state.stack.approved ? undefined : "Groups can only be added to Stacks shared by Owner"
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

    private getTableColumns(): Column[] {
        return [
            { Header: "Group Name", id: "name", accessor: (stack: StackDTO) => stack.name },
            { Header: "Users", id: "totalUsers", accessor: (stack: StackDTO) => stack.totalUsers },
            { Header: "Widgets", id: "totalWidgets", accessor: (stack: StackDTO) => stack.totalWidgets },
            { Header: "Dashboards", id: "totalDashboards", accessor: (stack: StackDTO) => stack.totalDashboards },
            {
                Header: "Actions",
                Cell: (row: { original: StackDTO }) => (
                    <div>
                        <ButtonGroup
                            data-role="dashboard-admin-widget-group-actions"
                            data-groupname={row.original.name}
                        >
                            <DeleteButton onClick={() => this.deleteGroup(row.original)} />
                        </ButtonGroup>
                    </div>
                )
            }
        ];
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
        stackApi.getStackById(this.state.stack.id).then((response) => {
            this.setState({
                loading: false,
                groups: response.data.data[0].groups
            });
        });
    }

    private addGroups = async (groups: Array<GroupDTO>) => {
        const response = await stackApi.addStackGroups(this.state.stack.id, groups);
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
            onConfirm: () => this.removeGroup(user)
        });
        return true;
    };

    private handleConfirmationConfirmDelete = async (group: GroupDTO) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined
        });

        stackApi.removeStackGroups(this.state.stack.id, [group]).then(() => this.getStackGroups());
    };

    private handleConfirmationCancel = () => {
        this.setState({
            showDelete: false,
            manageGroup: undefined
        });
    };
}
