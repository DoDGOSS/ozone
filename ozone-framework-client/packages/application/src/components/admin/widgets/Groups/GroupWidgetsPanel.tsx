import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";
import { GroupWidgetsEditDialog } from './GroupWidgetEditDialog'

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";

import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";

import { UserQueryCriteria } from "../../../../api/clients/UserAPI";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

interface GroupEditWidgetProps {
    onUpdate: (update?: any) => void;
    group: any;
}

export interface GroupEditWidgetState {
    widgets: WidgetDTO[];
    filtered: WidgetDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    group: any;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageWidget: WidgetDTO | undefined;
}

export class GroupWidgetsPanel extends React.Component<GroupEditWidgetProps, GroupEditWidgetState> {
    private static readonly SELECT_WIDGET_COLUMN_DEFINITION = [
        {
            Header: "Widgets",
            columns: [
                { Header: "Name", accessor: "displayName" },
                { Header: "Description", accessor: "description" },
                { Header: "Version", accessor: "version" },
                { Header: "Url", accessor: "url" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Type", accessor: "widgetTypes" }
            ]
        }
    ];
    private readonly WIDGET_COLUMN_DEFINITION = [
        {
            Header: "widgets",
            columns: [
                { Header: "Name", accessor: "displayName" },
                { Header: "Description", accessor: "description" },
                { Header: "Version", accessor: "version" },
                { Header: "Url", accessor: "url" },
                { Header: "Widgets", accessor: "totalWidgets" },
                { Header: "Type", accessor: "widgetTypes" }
            ]
        },
        {
            Header: "Actions",
            Cell: (row: any) => (
                <div>
                    <ButtonGroup>
                        <Button
                            data-element-id="group-admin-widget-delete-widget-button"
                            text="Delete"
                            intent={Intent.DANGER}
                            icon="trash"
                            small={true}
                            onClick={() => this.deleteWidget(row.original)}
                        />
                    </ButtonGroup>
                </div>
            )
        }
    ];

    constructor(props: GroupEditWidgetProps) {
        super(props);
        this.state = {
            widgets: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            group: this.props.group,
            showAdd: false,
            showDelete: false,
            confirmationMessage: "",
            manageWidget: undefined
        };
    }

    componentDidMount() {
        this.getWidgets();
    }

    render() {
        let data = this.state.widgets;
        const filter = this.state.filter.toLowerCase();

        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter((row) => {
                return (
                    row.displayName.toLowerCase().includes(filter) ||
                    row.description.toLowerCase().includes(filter) ||
                    row.widgetUrl.toLowerCase().includes(filter) 
                );
            });
        }

        return (
            <div data-element-id="group-admin-add-widget">
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
                        columns={this.WIDGET_COLUMN_DEFINITION}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="group-edit-add-widget-dialog-add-button"
                    />
                </div>

                <GroupWidgetsEditDialog
                    show={this.state.showAdd}
                    title="Add Widget(s) to Group"
                    confirmHandler={this.handleAddWidgetResponse}
                    cancelHandler={this.handleAddWidgetCancel}
                    columns={GroupWidgetsPanel.SELECT_WIDGET_COLUMN_DEFINITION}
                />

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageWidget}
                />
            </div>
        );
    }

    private toggleShowAdd() {
        this.setState({
            showAdd: true
        });
    }

    private getWidgets = async () => {
        const currentGroup: GroupDTO = this.state.group;

        const criteria: UserQueryCriteria = {
            group_id: currentGroup.id
        };
        // check the widget api get widget critieria
        const response = await widgetApi.getWidgets(criteria);

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgets: response.data.data,
            loading: false
        });
    };

    private handleAddWidgetResponse = async (widgets: Array<WidgetDTO>) => {

        const request: GroupUpdateRequest = {
            id: this.state.group.id,
            tab: "Widgets",
            name: this.state.group.name,
            update_action: "add",
            data: widgets.map((widget: WidgetDTO) => widget.id)
        };

        const response = await groupApi.updateGroup(request);

        if (response.status !== 200) return;

        this.setState({
            showAdd: false
        });

        this.getWidgets();
        this.props.onUpdate(response.data.data);
    };

    private handleAddWidgetCancel = () => {
        this.setState({
            showAdd: false
        });
    };

    private deleteWidget = async (widget: WidgetDTO) => {
        const currentGroup: GroupDTO = this.state.group;

        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>
            ${
                widget.displayName
            }
            </strong> from the group <strong>${currentGroup.name}</strong>`,
            manageWidget:widget
        });

        this.getWidgets();

        return true;
    };

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageWidget: undefined
        });

        const widget: WidgetDTO = payload;

        // chekc to see if I have to change gorup update request
        // to widget update request
        const request: GroupUpdateRequest = {
            id: this.state.group.id,
            tab: "Widgets",
            name: this.state.group.name,
            update_action: "add",
            data: widget.id
        };

        const response = await groupApi.updateGroup(request);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getWidgets();
        this.props.onUpdate();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageWidget: undefined
        });
    };

}
