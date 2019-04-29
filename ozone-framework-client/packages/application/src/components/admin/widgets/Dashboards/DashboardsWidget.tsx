import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, ButtonGroup, Divider, InputGroup, Intent } from "@blueprintjs/core";
import { AdminTable } from "../../table/AdminTable";

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { DashboardEditTabs } from "./DashboardEditTabs";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";

export interface State {
    stacks: StackDTO[];
    filtered: StackDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showEditStack: boolean;
    showAssignToMe: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageStack: StackDTO | undefined;
    updatingStack?: any;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Error handling for form (if username exists etc)

enum DashboardWidgetSubSection {
    TABLE,
    EDIT
}

export class DashboardsWidget extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            stacks: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            showTable: true,
            showEditStack: false,
            showAssignToMe: false,
            showDelete: false,
            confirmationMessage: "",
            manageStack: undefined,

            columns: [
                {
                    Header: "Stacks",
                    columns: [
                        { Header: "Title", accessor: "name" },
                        { Header: "Pages (Dashboards)", accessor: "totalDashboards" },
                        { Header: "Widgets", accessor: "totalWidgets" },
                        { Header: "Groups", accessor: "totalGroups" },
                        { Header: "Users", accessor: "totalUsers" }
                    ]
                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => (
                        <div>
                            <ButtonGroup
                                data-role="dashboard-admin-widget-actions"
                                data-dashboardname={row.original.name}
                            >
                                <Button
                                    data-element-id="dashboard-admin-widget-edit-button"
                                    text="Edit"
                                    intent={Intent.PRIMARY}
                                    icon="edit"
                                    small={true}
                                    onClick={() => (
                                        this.showSubSection(DashboardWidgetSubSection.EDIT),
                                        this.setState({ updatingStack: row.original })
                                    )}
                                />
                                <Divider />
                                <Button
                                    data-element-id={"dashboard-admin-widget-assign-to-me"}
                                    text="Assign To Me"
                                    intent={Intent.SUCCESS}
                                    icon="following"
                                    small={true}
                                    onClick={() => this.deleteStack(row.original)}
                                />
                                <Divider />
                                <Button
                                    data-element-id="dashboard-admin-widget-delete-button"
                                    text="Delete"
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    disabled={row.original.totalStacks > 0}
                                    onClick={() => this.deleteStack(row.original)}
                                />
                            </ButtonGroup>
                        </div>
                    )
                }
            ]
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getStacks();
    }

    render() {
        const showTable = this.state.showTable;
        const showEditStack = this.state.showEditStack;

        let data = this.state.stacks;
        const filter = this.state.filter.toLowerCase();

        if (filter) {
            data = data.filter((row) => {
                return row.name.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="dashboard-admin-widget-dialog">
                {showTable && (
                    <div className={styles.actionBar}>
                        <InputGroup
                            placeholder="Search..."
                            leftIcon="search"
                            value={this.state.filter}
                            onChange={(e: any) => this.setState({ filter: e.target.value })}
                            data-element-id="search-field"
                        />
                    </div>
                )}

                {showTable && (
                    <div className={styles.table}>
                        <AdminTable
                            data={data}
                            columns={this.state.columns}
                            loading={this.state.loading}
                            pageSize={this.state.pageSize}
                        />
                    </div>
                )}

                {showEditStack && (
                    <DashboardEditTabs
                        stack={this.state.updatingStack}
                        onUpdate={this.handleUpdate}
                        onBack={() => {
                            this.showSubSection(DashboardWidgetSubSection.TABLE);
                        }}
                    />
                )}

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageStack}
                />
            </div>
        );
    }

    private showSubSection(subSection: DashboardWidgetSubSection) {
        this.setState({
            showTable: subSection === DashboardWidgetSubSection.TABLE,
            showEditStack: subSection === DashboardWidgetSubSection.EDIT
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

    private deleteStack = async (stack: StackDTO) => {
        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${stack.name}</strong>`,
            manageStack: stack
        });

        this.getStacks();

        return true;
    };

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageStack: undefined
        });

        const stack: StackDTO = payload;

        const response = await stackApi.deleteStackAsAdmin(stack.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getStacks();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageStack: undefined
        });
    };
}
