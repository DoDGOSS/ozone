import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { GroupWidgetsEditDialog } from './GroupWidgetEditDialog'

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";

import { groupApi } from "../../../../api/clients/GroupAPI";
import { GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";

import { UserQueryCriteria } from "../../../../api/clients/UserAPI";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTable } from "../Widgets/WidgetTable";

// ask jeff which part of the panel is actually rendering the data that is set to widgets


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
                { Header: "Name", accessor: "value.namespace" },
                { Header: "Description", accessor: "value.description" },
                { Header: "Version", accessor: "value.version" },
                { Header: "Groups", accessor: "value.totalGroups"},
                { Header: "Users", accessor: "value.totalUsers"}
            ]
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

        if (filter) {
            data = data.filter((row) => {
                return (
                    row.namespace.toLowerCase().includes(filter) 
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
                    <WidgetTable
                        data={data}
                        // columns={this.WIDGET_COLUMN_DEFINITION}
                        onDelete={this.deleteWidget}
                        isLoading={this.state.loading}
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
        const response = await widgetApi.getWidgets(criteria);

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgets: response.data.data,
            loading: false
        });
    };

    private handleAddWidgetResponse = async (widgets: Array<WidgetDTO>) => {

        // const request: GroupUpdateRequest = {
        //     id: this.state.group.id,
        //     tab: "widget",
        //     name: this.state.group.name,
        //     update_action: "add",
        //     data: widgets.map((widget: WidgetDTO) => widget.id)
        // };

        const responses = [];
        for (const widget of widgets){
            const response = await widgetApi.addWidgetGroups(widget.id, this.state.group.id);
            if(response.status !== 200) return;

            responses.push(response.data.data);
        }

        this.setState({
            showAdd: false
        });

        this.getWidgets();
        this.props.onUpdate(responses);

        return responses;
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
                widget.value.namespace
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

        // const request: GroupUpdateRequest = {
        //     id: this.state.group.id,
        //     tab: "widget",
        //     name: this.state.group.name,
        //     update_action: "add",
        //     data: widget.id
        // };

        // const response = await groupApi.updateGroup(request);

        const response = await widgetApi.removeWidgetGroups(widget.id, this.state.group.id)

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
