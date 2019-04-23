import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, ButtonGroup, Divider, InputGroup, Intent } from "@blueprintjs/core";
import { GenericTable } from "../../table/GenericTable";
import { DeleteButton, EditButton } from "../../table/TableButtons";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { GroupSetup } from "./GroupSetup";
import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupCreateRequest, GroupDTO } from "../../../../api/models/GroupDTO";

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
// Popup warning dialogue for deleting
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
            showGroupSetup: false
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
                                text="Create"
                                onClick={() => this.showSubSection(GroupWidgetSubSection.CREATE)}
                                data-element-id="group-admin-widget-create-button"
                            />
                        </div>
                    </div>
                )}

                {showGroupSetup && (
                    <GroupSetup
                        group={this.state.updatingGroup}
                        onSave={this.handleUpdate}
                        onBack={() => {
                            this.showSubSection(GroupWidgetSubSection.TABLE);
                        }}
                    />
                )}
            </div>
        );
    }

    private getColumns(): Column[] {
        return [
            { Header: "Group Name", id: "name", accessor: (group: Group) => group.name },
            { Header: "Users", id: "totalUsers", accessor: (group: Group) => group.totalUsers },
            { Header: "Widgets", id: "totalWidgets", accessor: (group: Group) => group.totalWidgets },
            { Header: "Dashboards", id: "totalDashboards", accessor: (group: Group) => group.totalDashboards },
            {
                Header: "Actions",
                Cell: (row: any) => (
                    <div>
                        <ButtonGroup>
                            <EditButton
                                onClick={() => (
                                    this.showSubSection(GroupWidgetSubSection.EDIT),
                                    this.setState({ updatingGroup: row.original })
                                )}
                            />
                            <Divider />
                            <DeleteButton
                                disabled={row.original.totalStacks > 0}
                                onClick={() => this.deleteGroup(row.original)}
                            />
                        </ButtonGroup>
                    </div>
                )
            }
        ];
    }

    private showSubSection(subSection: GroupWidgetSubSection) {
        this.setState({
            showTable: subSection === GroupWidgetSubSection.TABLE,
            showGroupSetup: subSection === GroupWidgetSubSection.SETUP
        });
    }

    private getGroups = async () => {
        const response = await groupApi.getGroups();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            groups: response.data.data,
            loading: false
        });
    };

    private handleUpdate(update?: any) {
        this.getGroups();
    }

    private deleteGroup = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined
        });

        const group: GroupDTO = payload;

        const response = await groupApi.deleteGroup(group.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getGroups();

        return true;
    };
}
