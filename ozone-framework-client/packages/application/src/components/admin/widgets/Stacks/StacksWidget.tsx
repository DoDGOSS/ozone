import * as React from "react";

import { Button, ButtonGroup, Divider, Intent } from "@blueprintjs/core";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";

import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { CompactDeleteButton, CompactShareButton, DeleteButton, EditButton } from "../../../generic-table/TableButtons";

import { StackSetup } from "./StackSetup";

interface StacksWidgetState {
    stacks: StackDTO[];
    loading: boolean;
    showTable: boolean;
    showStackSetup: boolean;
    updatingStack: StackDTO | undefined;
}

enum StackWidgetSubSection {
    TABLE,
    SETUP
}

export class StacksWidget extends React.Component<{}, StacksWidgetState> {
    defaultPageSize: number = 5;
    _isMounted: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            stacks: [],
            loading: true,
            showTable: true,
            showStackSetup: false,
            updatingStack: undefined
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.getStacks();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const showTable = this.state.showTable;
        const showStackSetup = this.state.showStackSetup;

        return (
            <div data-element-id="stack-admin-widget-dialog">
                {showTable && (
                    <div>
                        <GenericTable
                            title={"Stack Permissions"}
                            items={this.state.stacks}
                            getColumns={() => this.getTableColumns()}
                            tableProps={{
                                loading: this.state.loading,
                                paginationSize: this.defaultPageSize
                            }}
                        />
                    </div>
                )}

                {showStackSetup && (
                    <StackSetup
                        stack={this.state.updatingStack}
                        onUpdate={this.handleUpdate}
                        onBack={async () => {
                            await this.getStacks();
                            this.showSubSection(StackWidgetSubSection.TABLE);
                        }}
                    />
                )}
            </div>
        );
    }

    private showSubSection(subSection: StackWidgetSubSection) {
        this.setState({
            showTable: subSection === StackWidgetSubSection.TABLE,
            showStackSetup: subSection === StackWidgetSubSection.SETUP
        });
    }

    private getStacks = async () => {
        const response = await stackApi.getStacksAsAdmin();

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return;

        if (!this._isMounted) {
            return;
        }

        this.setState({
            stacks: response.data.data,
            loading: false
        });
    };

    private handleUpdate(update?: any) {
        this.getStacks();
    }

    private getTableColumns(): ColumnTabulator[] {
        return [
            { title: "Title", field: "name" },
            { title: "Owner", field: "owner.username" },
            { title: "Dashboards", field: "totalDashboards" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Groups", field: "totalGroups" },
            { title: "Users", field: "totalUsers" },
            {
                title: "Actions",
                width: 275,
                responsive: 0,
                formatter: (row: { cell: { _cell: { row: { data: StackDTO } } } }) => {
                    const data: StackDTO = row.cell._cell.row.data;
                    return (
                        <ButtonGroup data-role="stack-admin-widget-actions" data-dashboardname={data.name}>
                            <CompactShareButton
                                onClick={() => {
                                    this.confirmShare(data);
                                }}
                                itemName={"Share this stack with other users"}
                            />
                            <Divider />
                            <EditButton
                                onClick={() => {
                                    this.setState({ updatingStack: data });
                                    this.showSubSection(StackWidgetSubSection.SETUP);
                                }}
                            />
                            <Divider />
                            <Button
                                data-element-id={"stack-admin-widget-assign-to-me"}
                                text="Assign To Me"
                                intent={Intent.SUCCESS}
                                icon="following"
                                small={true}
                                // TODO - Disable if owner === currentUser
                                // disabled={}
                                onClick={() => {
                                    this.confirmAssignToMe(data);
                                }}
                            />
                            <Divider />
                            <CompactDeleteButton onClick={() => this.confirmDeleteStack(data)} itemName={data.name} />
                        </ButtonGroup>
                    );
                }
            }
        ] as ColumnTabulator[];
    }

    private async confirmAssignToMe(stack: StackDTO) {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "You are attempting to assign stack: ",
                { text: stack.name, style: "bold" },
                " to yourself. This stack cannot be re-assigned after this action is performed. "
            ],
            onConfirm: () => this.onAssignConfirm(stack)
        });
    }

    private async onAssignConfirm(stack: StackDTO) {
        try {
            const response = await stackApi.assignStackToMe(stack.id);
            if (!(response.status >= 200 && response.status < 400)) return false;
        } catch (e) {
            return false;
        }
        this.getStacks();
        return true;
    }

    private async confirmShare(stack: StackDTO) {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "You are allowing ",
                { text: stack.name, style: "bold" },
                " to be shared with other users. Press OK to confirm."
            ],
            onConfirm: () => this.onShareConfirmed(stack)
        });
    }

    private async onShareConfirmed(stack: StackDTO) {
        try {
            const response = await stackApi.shareStack(stack.id);
            if (!(response.status >= 200 && response.status < 400)) return false;
        } catch (e) {
            return false;
        }
        return true;
    }

    private confirmDeleteStack = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: stack.name, style: "bold" }, "."],
            onConfirm: () => this.removeStack(stack)
        });
        return true;
    };

    private removeStack = async (stack: StackDTO) => {
        const response = await stackApi.deleteStackAsAdmin(stack.id);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return false;

        this.getStacks();

        return true;
    };
}
