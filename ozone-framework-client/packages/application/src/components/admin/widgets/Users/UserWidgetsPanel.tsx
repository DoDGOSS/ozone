import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, InputGroup } from "@blueprintjs/core";

import { widgetApi, WidgetQueryCriteria } from "../../../../api/clients/WidgetAPI";
import { UserDTO } from "../../../../api/models/UserDTO";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { UserWidgetsEditDialog } from "./UserWidgetsEditDialog";
import { WidgetTable } from "../Widgets/WidgetTable";

interface UserEditWidgetsProps {
    onUpdate: (update?: any) => void;
    user: any;
}

export interface UserEditWidgetsState {
    widgets: WidgetDTO[];
    filtered: WidgetDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    user: any;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageWidget: WidgetDTO | undefined;
}

export class UserWidgetsPanel extends React.Component<UserEditWidgetsProps, UserEditWidgetsState> {
    private static readonly SELECT_WIDGETS_COLUMN_DEFINITION = [
        {
            Header: "Widgets",
            columns: [
                { Header: "Title", accessor: "value.namespace" },
                { Header: "URL", accessor: "value.url" },
                { Header: "Users", accessor: "value.totalUsers" },
                { Header: "Groups", accessor: "value.totalGroups" }
            ]
        }
    ];

    constructor(props: UserEditWidgetsProps) {
        super(props);
        this.state = {
            widgets: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            user: this.props.user,
            showAdd: false,
            showDelete: false,
            confirmationMessage: "",
            manageWidget: undefined
        };

        this.deleteWidget = this.deleteWidget.bind(this);
    }

    componentDidMount() {
        this.getWidgets();
    }

    render() {
        let data = this.state.widgets;
        const filter = this.state.filter.toLowerCase();

        if (filter) {
            data = data.filter((row) => {
                return row.value.namespace.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="user-admin-add-widget">
                <div className={styles.actionBar}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        value={this.state.filter}
                        onChange={(e: any) => this.setState({ filter: e.target.value })}
                        data-element-id="search-field"
                    />
                </div>

                <WidgetTable
                    data={data}
                    isLoading={this.state.loading}
                    onDelete={this.deleteWidget}
                    pageSize={this.state.pageSize}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="user-edit-add-widget-dialog-add-button"
                    />
                </div>

                <UserWidgetsEditDialog
                    show={this.state.showAdd}
                    title="Add Widget(s) to User"
                    confirmHandler={this.handleAddWidgetResponse}
                    cancelHandler={this.handleAddWidgetCancel}
                    columns={UserWidgetsPanel.SELECT_WIDGETS_COLUMN_DEFINITION}
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
        const currentUser: UserDTO = this.state.user;

        const criteria: WidgetQueryCriteria = {
            user_id: currentUser.id
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
        const responses = [];
        for (const widget of widgets) {
            const response = await widgetApi.addWidgetUsers(widget.id, this.state.user.id);
            if (response.status !== 200) return;

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
        const currentUser: UserDTO = this.state.user;

        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permenantly delete <strong>${
                widget.value.namespace
            }</strong> from the user <strong>${currentUser.userRealName}</strong>`,
            manageWidget: widget
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
        const response = await widgetApi.removeWidgetUsers(widget.id, this.state.user.id);

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
