import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";
import { StackGroupsEditDialog } from "./StackGroupsEditDialog";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";
import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";
import { DashboardDTO } from "../../../../api/models/DashboardDTO";

interface StackEditGroupsProps {
    onUpdate: (update?: any) => void;
    stack: any;
}

export interface StackEditGroupsState {
    groups: GroupDTO[];
    filtered: GroupDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    stack: StackDTO;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageGroup: GroupDTO | undefined;
}

// TODO It should close regardless. Apply fix to stackapi that was applied to 
export class StackGroupsPanel extends React.Component<StackEditGroupsProps, StackEditGroupsState> {
    private static readonly SELECT_GROUPS_COLUMN_DEFINITION = [
        {
            Header: "Groups",
            columns: [
                { Header: "Group Name", accessor: "name" },
                { Header: "Users", accessor: "totalUsers" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Dashboards", accessor: "totalDashboards" }
            ]
        }
    ];
    private readonly GROUPS_COLUMN_DEFINITION = [
        {
            Header: "Groups",
            columns: [
                { Header: "Group Name", accessor: "name" },
                { Header: "Users", accessor: "totalUsers" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Dashboards", accessor: "totalDashboards" }
            ]
        },
        {
            Header: "Actions",
            Cell: (row: any) => (
                <div>
                    <ButtonGroup data-role="dashboard-admin-widget-group-actions" data-groupname={row.original.name}>
                        <Button
                            data-element-id="dashboard-admin-widget-delete-group-button"
                            text="Delete"
                            intent={Intent.DANGER}
                            icon="trash"
                            small={true}
                            onClick={() => this.deleteGroup(row.original)}
                        />
                    </ButtonGroup>
                </div>
            )
        }
    ];

    constructor(props: StackEditGroupsProps) {
        super(props);
        this.state = {
            groups: this.props.stack.groups,
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            stack: this.props.stack,
            showAdd: false,
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
                <div className={styles.actionBar}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        value={this.state.filter}
                        onChange={(e: any) => this.setState({ filter: e.target.value })}
                        data-element-id="search-field"
                    />
                </div>

                <div className={styles.table}>
                    <AdminTable
                        data={data}
                        columns={this.GROUPS_COLUMN_DEFINITION}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        disabled={!this.state.stack.approved}
                        title={
                            this.state.stack.approved ? undefined : "Groups can only be added to Stacks shared by Owner"
                        }
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="group-edit-add-group-dialog-add-button"
                    />
                </div>

                <StackGroupsEditDialog
                    show={this.state.showAdd}
                    title="Add Group(s) to Stack"
                    confirmHandler={this.handleAddGroupResponse}
                    cancelHandler={this.handleAddGroupCancel}
                    columns={StackGroupsPanel.SELECT_GROUPS_COLUMN_DEFINITION}
                />

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageGroup}
                />
            </div>
        );
    }

    private toggleShowAdd() {
        this.setState({
            showAdd: true
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

    private handleAddGroupResponse = async (groups: Array<GroupDTO>) => {
        const response = await stackApi.addStackGroups(this.state.stack.id, groups);
        if (response.status !== 200) {
            return;
        }

        this.setState({
            showAdd: false
        });

        this.getStackGroups();
    };

    private handleAddGroupCancel = () => {
        this.setState({
            showAdd: false
        });
    };

    private deleteGroup = async (group: GroupDTO) => {
        const currentStack: StackDTO = this.state.stack;

        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${
                group.displayName
            }</strong> from the dashboard <strong>${currentStack.name}</strong>`,
            manageGroup: group
        });
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
