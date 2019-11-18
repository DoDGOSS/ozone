import * as React from "react";

import { Button, ButtonGroup, Divider } from "@blueprintjs/core";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";
import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";

import { GroupSetup } from "./GroupSetup";
import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupDTO, isDefaultGroup } from "../../../../api/models/GroupDTO";

import * as styles from "../Widgets.scss";

interface State {
    groups: GroupDTO[];
    loading: boolean;
    showTable: boolean;
    showGroupSetup: boolean;
    updatingGroup: GroupDTO | undefined;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Error handling for form

enum GroupWidgetSubSection {
    TABLE,
    SETUP
}

export class GroupsWidget extends React.Component<{}, State> {
    _isMounted: boolean = false;
    defaultPageSize: number = 5;

    constructor(props: any) {
        super(props);
        this.state = {
            groups: [],
            loading: true,
            showTable: true,
            showGroupSetup: false,
            updatingGroup: undefined
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.getGroups();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const showTable = this.state.showTable;
        const showGroupSetup = this.state.showGroupSetup;

        return (
            <div data-element-id="group-admin-widget-dialog">
                {showTable && (
                    <div>
                        <GenericTable
                            items={this.state.groups}
                            getColumns={() => this.getColumns()}
                            tableProps={{
                                loading: this.state.loading,
                                paginationSize: this.defaultPageSize
                            }}
                        />
                        <div className={styles.buttonBar}>
                            <Button
                                text={"Create"}
                                onClick={() => {
                                    this.setState({ updatingGroup: undefined });
                                    this.showSubSection(GroupWidgetSubSection.SETUP);
                                }}
                                data-element-id="group-admin-widget-create-button"
                            />
                        </div>
                    </div>
                )}

                {showGroupSetup && (
                    <GroupSetup
                        updatingGroup={this.state.updatingGroup}
                        onUpdate={() => this.handleUpdate()}
                        onBack={() => {
                            this.handleUpdate();
                            this.showSubSection(GroupWidgetSubSection.TABLE);
                        }}
                    />
                )}
            </div>
        );
    }

    private getColumns(): ColumnTabulator[] {
        return [
            { title: "Group Name", field: "name" },
            { title: "Users", field: "totalUsers" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Stacks", field: "totalStacks" },
            {
                title: "Actions",
                responsive: 0,
                width: 180,
                formatter: (row: any) => {
                    const data: GroupDTO = row.cell._cell.row.data;
                    return (
                        <div>
                            <ButtonGroup>
                                <EditButton
                                    onClick={() => {
                                        this.showSubSection(GroupWidgetSubSection.SETUP);
                                        this.setState({ updatingGroup: data });
                                    }}
                                />
                                <Divider />
                                <DeleteButton
                                    disabled={data.totalStacks > 0 || isDefaultGroup(data)}
                                    onClick={() => this.confirmDeleteGroup(data)}
                                />
                            </ButtonGroup>
                        </div>
                    );
                }
            }
        ];
    }

    private showSubSection(subSection: GroupWidgetSubSection): void {
        this.setState({
            showTable: subSection === GroupWidgetSubSection.TABLE,
            showGroupSetup: subSection === GroupWidgetSubSection.SETUP
        });
    }

    private async getGroups(): Promise<void> {
        const response = await groupApi.getGroups();

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return;

        if (!this._isMounted) {
            return;
        }

        this.setState({
            groups: response.data.data,
            loading: false
        });
    }

    private handleUpdate(update?: any): void {
        this.getGroups();
    }

    private confirmDeleteGroup(group: GroupDTO): void {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: group.name, style: "bold" }, "."],
            onConfirm: () => this.deleteGroup(group)
        });
    }

    private async deleteGroup(group: GroupDTO): Promise<boolean> {
        const response = await groupApi.deleteGroup(group.id);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return false;

        this.getGroups();

        return true;
    }
}
