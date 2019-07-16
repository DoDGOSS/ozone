import * as React from "react";

import { Button, ButtonGroup, Divider, Intent } from "@blueprintjs/core";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";

import { StackSetup } from "./StackSetup";

import * as styles from "../Widgets.scss";

interface StacksWidgetState {
    stacks: StackDTO[];
    loading: boolean;
    showTable: boolean;
    showStackSetup: boolean;
    showAssignToMe: boolean;
    updatingStack: StackDTO | undefined;
}
// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style

enum StackWidgetSubSection {
    TABLE,
    SETUP
}

// everything else has been changed to `Stacks*` because that's what they are, but this and src/stores/system-widgets
// have been kept as DashboardsWidget out of fear of changing the name.
export class DashboardsWidget extends React.Component<{}, StacksWidgetState> {
    defaultPageSize: number = 5;

    constructor(props: any) {
        super(props);
        this.state = {
            stacks: [],
            loading: true,
            showTable: true,
            showAssignToMe: false,
            showStackSetup: false,
            updatingStack: undefined
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getStacks();
    }

    render() {
        const showTable = this.state.showTable;
        const showStackSetup = this.state.showStackSetup;

        return (
            <div data-element-id="dashboard-admin-widget-dialog">
                {showTable && (
                    <div>
                        <GenericTable
                            title={"Stacks"}
                            items={this.state.stacks}
                            getColumns={() => this.getTableColumns()}
                            tableProps={{
                                loading: this.state.loading,
                                paginationSize: this.defaultPageSize
                            }}
                        />
                        <div className={styles.buttonBar}>
                            <Button
                                text="Create"
                                onClick={() => {
                                    this.setState({ updatingStack: undefined });
                                    this.showSubSection(StackWidgetSubSection.SETUP);
                                }}
                                data-element-id="create-dashboard-button"
                            />
                        </div>
                    </div>
                )}

                {showStackSetup && (
                    <StackSetup
                        stack={this.state.updatingStack}
                        onUpdate={this.handleUpdate}
                        onBack={() => {
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
        const response = await stackApi.getStacks();

        // TODO: Handle failed request
        if (response.status !== 200) return;

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
            { title: "Dashboards", field: "totalDashboards" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Groups", field: "totalGroups" },
            { title: "Users", field: "totalUsers" },
            {
                title: "Actions",
                width: 300,
                responsive: 0,
                formatter: (row: { cell: { _cell: { row: { data: StackDTO } } } }) => {
                    const data: StackDTO = row.cell._cell.row.data;
                    return (
                        <ButtonGroup data-role="dashboard-admin-widget-actions" data-dashboardname={data.name}>
                            <EditButton
                                onClick={() => {
                                    this.setState({ updatingStack: data });
                                    this.showSubSection(StackWidgetSubSection.SETUP);
                                }}
                            />
                            <Divider />
                            <Button
                                data-element-id={"dashboard-admin-widget-assign-to-me"}
                                text="Assign To Me"
                                intent={Intent.SUCCESS}
                                icon="following"
                                small={true}
                                onClick={() => {
                                    console.log("Unimplemented: should assign ", data, "to current user (you).");
                                }}
                                data-widget-name={data.name}
                            />
                            <Divider />
                            <DeleteButton onClick={() => this.confirmDeleteStack(data)} itemName={data.name} />
                        </ButtonGroup>
                    );
                }
            }
        ] as ColumnTabulator[];
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
        if (response.status !== 200) return false;

        this.getStacks();

        return true;
    };
}
