import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";
import { GroupStacksEditDialog } from "./GroupStacksEditDialog";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";

import { GroupDTO } from "../../../../api/models/GroupDTO";
import { stackApi, StackQueryCriteria } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";

interface GroupEditStacksProps {
    onUpdate: (update?: any) => void;
    group: GroupDTO;
}

export interface GroupEditStacksState {
    stacks: StackDTO[];
    loading: boolean;
    showAdd: boolean;
}

export class GroupStacksPanel extends React.Component<GroupEditStacksProps, GroupEditStacksState> {
    defaultPageSize: number = 5;

    constructor(props: GroupEditStacksProps) {
        super(props);
        this.state = {
            stacks: [],
            loading: true,
            showAdd: false
        };
    }

    componentDidMount() {
        this.getStacks();
    }

    render() {
        return (
            <div data-element-id="group-admin-add-stack">
                <GenericTable
                    items={this.state.stacks}
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
                        data-element-id="group-edit-add-stack-dialog-add-button"
                    />
                </div>

                <GroupStacksEditDialog show={this.state.showAdd} onSubmit={this.addStacks} onClose={this.closeDialog} />
            </div>
        );
    }

    private getTableColumns(): ColumnTabulator[] {
        return [
            { title: "Title", field: "name" },
            { title: "Pages (Dashboards)", field: "totalDashboards" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Groups", field: "totalGroups" },
            { title: "Users", field: "totalUsers" },
            {
                title: "Actions",
                responsive: 0,
                width: 90,
                formatter: (row: any) => {
                    const data: StackDTO = row.cell._cell.row.data;
                    return (
                        <ButtonGroup>
                            <DeleteButton onClick={() => this.confirmRemoveStack(data)} itemName={data.name} />
                        </ButtonGroup>
                    );
                }
            }
        ];
    }

    private showAdd() {
        this.setState({
            showAdd: true
        });
    }

    private getStacks = async () => {
        const currentGroup: GroupDTO = this.props.group;

        const criteria: StackQueryCriteria = {
            groupId: currentGroup.id
        };

        const response = await stackApi.getStacks(criteria);

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            stacks: response.data.data,
            loading: false
        });
    };

    private addStacks = async (stacks: Array<StackDTO>) => {
        for (const newStack of stacks) {
            const response = await stackApi.addStackGroups(newStack.id, [this.props.group]);
            if (response.status !== 200) break;
        }

        this.setState({
            showAdd: false,
            loading: true
        });

        this.getStacks();
        this.props.onUpdate();
    };

    private closeDialog = () => {
        this.setState({
            showAdd: false
        });
    };

    private confirmRemoveStack = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: stack.name, style: "bold" },
                " from group ",
                { text: this.props.group.name, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeStack(stack)
        });
    };

    private async removeStack(stack: StackDTO): Promise<boolean> {
        const response = await stackApi.removeStackGroups(stack.id, [this.props.group]);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.setState({
            loading: true
        });

        this.getStacks();
        this.props.onUpdate();

        return true;
    }
}
