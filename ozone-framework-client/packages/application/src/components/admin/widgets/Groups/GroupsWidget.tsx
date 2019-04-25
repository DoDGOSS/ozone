import * as React from "react";
import { Column } from "react-table";

import { Button, ButtonGroup, Divider, InputGroup, Intent } from "@blueprintjs/core";
import { GenericTable } from "../../table/GenericTable";
import { DeleteButton, EditButton } from "../../table/TableButtons";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { GroupSetup } from "./GroupSetup";
import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupCreateRequest, GroupDTO } from "../../../../api/models/GroupDTO";

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
        this.getGroups();
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
                            reactTableProps={{
                                loading: this.state.loading,
                                pageSize: this.defaultPageSize
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

    private getColumns(): Column[] {
        return [
            { Header: "Group Name", id: "name", accessor: (group: GroupDTO) => group.name },
            { Header: "Users", id: "totalUsers", accessor: (group: GroupDTO) => group.totalUsers },
            { Header: "Widgets", id: "totalWidgets", accessor: (group: GroupDTO) => group.totalWidgets },
            { Header: "Stacks", id: "totalStacks", accessor: (group: GroupDTO) => group.totalStacks },
            {
                Header: "Actions",
                Cell: (row: any) => (
                    <div>
                        <ButtonGroup>
                            <EditButton
                                onClick={() => (
                                    this.showSubSection(GroupWidgetSubSection.SETUP),
                                    this.setState({ updatingGroup: row.original })
                                )}
                            />
                            <Divider />
                            <DeleteButton
                                disabled={row.original.totalStacks > 0}
                                onClick={() => this.confirmDeleteGroup(row.original)}
                            />
                        </ButtonGroup>
                    </div>
                )
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
        if (response.status !== 200) return;

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
            message: ["This action will premanently delete ", { text: group.name, style: "bold" }, "."],
            onConfirm: () => this.deleteGroup(group)
        });
    }

    private async deleteGroup(group: GroupDTO): Promise<boolean> {
        const response = await groupApi.deleteGroup(group.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getGroups();

        return true;
    }
}
