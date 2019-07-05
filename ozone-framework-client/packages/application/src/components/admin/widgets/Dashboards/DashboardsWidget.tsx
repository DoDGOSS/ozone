import * as React from "react";

import { Button, ButtonGroup, Divider, Intent } from "@blueprintjs/core";
import { Column } from "react-table";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { GenericTable } from "../../../generic-table/GenericTable";
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
                            reactTableProps={{
                                loading: this.state.loading,
                                defaultPageSize: this.defaultPageSize
                            }}
                        />
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

    private getTableColumns(): Column[] {
        return [
            { Header: "Title", accessor: "name" },
            { Header: "Dashboards", accessor: "totalDashboards" },
            { Header: "Widgets", accessor: "totalWidgets" },
            { Header: "Groups", accessor: "totalGroups" },
            { Header: "Users", accessor: "totalUsers" },
            {
                Header: "Actions",
                Cell: (row: { original: StackDTO }) => (
                    <ButtonGroup data-role="dashboard-admin-widget-actions" data-dashboardname={row.original.name}>
                        <EditButton
                            onClick={() => {
                                this.setState({ updatingStack: row.original });
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
                                console.log("Unimplemented: should assign ", row.original, "to current user (you).");
                            }}
                            data-widget-name={row.original.name}
                        />
                        <Divider />
                        <DeleteButton
                            onClick={() => this.confirmDeleteStack(row.original)}
                            itemName={row.original.name}
                        />
                    </ButtonGroup>
                )
            }
        ];
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
