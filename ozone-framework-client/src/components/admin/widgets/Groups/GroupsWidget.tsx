import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, ButtonGroup, Divider, InputGroup, Intent  } from "@blueprintjs/core";
import { AdminTable } from "../../table/AdminTable";

import { GroupCreateForm } from "./GroupCreateForm";

import { lazyInject } from "../../../../inject";

import { GroupAPI, GroupCreateRequest, GroupDTO } from "../../../../api";
import { ConfirmationDialog } from 'src/components/confirmation-dialog/ConfirmationDialog';

import { GroupEditTabGroup } from './GroupEditTabGroup';

interface State {
    groups: GroupDTO[];
    filtered: GroupDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showCreate: boolean;
    showEditGroup: boolean;    
    showDelete: boolean;
    confirmationMessage: string;
    manageGroup: GroupDTO | undefined;
    updatingGroup?: any;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Popup warning dialogue for deleting
// Error handling for form

enum GroupWidgetSubSection {
    TABLE,
    CREATE,
    EDIT,
}

export class GroupsWidget extends React.Component<{}, State> {

    @lazyInject(GroupAPI)
    private groupAPI: GroupAPI;

    constructor(props: any) {
        super(props);
        this.state = {
            groups: [],
            filtered: [],
            filter: '',
            loading: true,
            pageSize: 5,
            showTable: true,
            showCreate: false,
            showEditGroup: false,
            showDelete: false,
            confirmationMessage: '',
            manageGroup: undefined,
            columns: [
                {
                    Header: "Groups",
                    columns: [
                        { Header: "Group Name", accessor: "name" },
                        { Header: "Users",      accessor: "totalUsers" },
                        { Header: "Widgets",    accessor: "totalWidgets" },
                        { Header: "Dashboards", accessor: "totalDashboards"  }
                    ],
                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => (
                        <div>
                            <ButtonGroup>
                                <Button
                                    data-element-id='group-admin-widget-edit-button'
                                    text="Edit"
                                    intent={Intent.PRIMARY}
                                    icon="edit"
                                    small={true}
                                    onClick={() => (
                                        this.showSubSection(GroupWidgetSubSection.EDIT),
                                        this.setState({updatingGroup: row.original})
                                    )}
                                />
                                <Divider/>
                                <Button
                                    data-element-id='group-admin-widget-delete-button'
                                    text="Delete"
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    disabled={row.original.totalStacks > 0}
                                    onClick={() => this.deleteGroup(row.original)}
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
        this.getGroups();
    }

    render() {
        const showTable = this.state.showTable;
        const showCreate = this.state.showCreate;
        const showEditGroup = this.state.showEditGroup;

        let data = this.state.groups;
        const filter = this.state.filter.toLowerCase();


        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter(row => {
                return row.name.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="group-admin-widget-dialog">
                {showTable &&
                <div className={styles.actionBar}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        value={this.state.filter}
                        onChange={(e: any) => this.setState({filter: e.target.value})}
                        data-element-id="search-field"
                    />
                </div>
                }

                {showTable &&
                <div className={styles.table}>
                    <AdminTable
                        data={data}
                        columns={this.state.columns}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>
                }

                {showTable &&
                <div className={styles.buttonBar}>
                    <Button
                        text="Create"
                        onClick={() => this.showSubSection(GroupWidgetSubSection.CREATE)}
                        data-element-id='group-admin-widget-create-button'
                    />
                </div>
                }

                {showCreate &&
                <GroupCreateForm
                onSubmit={this.createGroup}
                onCancel={() => {this.showSubSection(GroupWidgetSubSection.TABLE);}}
                />
                }

                {showEditGroup &&
                <GroupEditTabGroup
                    group={this.state.updatingGroup}
                    onUpdate={this.handleUpdate}
                    onBack={() => {this.showSubSection(GroupWidgetSubSection.TABLE);}}
                />
                }                

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title='Warning'
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageGroup} />
            </div>
        );
    }

    private showSubSection(subSection: GroupWidgetSubSection) {
        this.setState({
            showTable: subSection === GroupWidgetSubSection.TABLE,
            showCreate: subSection === GroupWidgetSubSection.CREATE,
            showEditGroup: subSection === GroupWidgetSubSection.EDIT,
        });
    }

    private getGroups = async () => {
        const response = await this.groupAPI.getGroups();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            groups: response.data.data,
            loading: false
        });
    }

    private handleUpdate(update?: any) {
        this.getGroups();
    }

    private createGroup = async (data: GroupCreateRequest) => {
        data.status = data.active ? 'active' : 'inactive';

        const response = await this.groupAPI.createGroup(data);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.showSubSection(GroupWidgetSubSection.TABLE);
        this.setState({ loading: true });
        this.getGroups();

        return true;
    }

    private deleteGroup = async (group: GroupDTO) => {
        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permenantly delete <strong>${group.name}</strong>`,
            manageGroup: group
        });

        this.getGroups();

        return true;
    }

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined,
        });

        const group: GroupDTO = payload;

        const response = await this.groupAPI.deleteGroup(group.id);
    
        // TODO: Handle failed request
        if (response.status !== 200) return false;
    
        this.getGroups();
    
        return true;

    }

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined,
        });
    }
}
