import * as React from "react";

import { Button, InputGroup } from "@blueprintjs/core";

import * as styles from "../Widgets.scss";

import { widgetApi, WidgetQueryCriteria } from "../../../../api/clients/WidgetAPI";
import { UserDTO } from "../../../../api/models/UserDTO";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { UserWidgetsEditDialog } from "./UserWidgetsEditDialog";
import { WidgetTable } from "../Widgets/WidgetTable";

interface UserEditWidgetsProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditWidgetsState {
    widgets: WidgetDTO[];
    loading: boolean;
    defaultPageSize: number;
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
            loading: true,
            defaultPageSize: 5,
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
        return (
            <div data-element-id="user-admin-add-widget">
                <WidgetTable
                    data={this.state.widgets}
                    isLoading={this.state.loading}
                    onDelete={this.deleteWidget}
                    defaultPageSize={this.state.defaultPageSize}
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
        const currentUser: UserDTO = this.props.user;

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
            const response = await widgetApi.addWidgetUsers(widget.id, this.props.user.id);
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
        const currentUser: UserDTO = this.props.user;

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
        const response = await widgetApi.removeWidgetUsers(widget.id, this.props.user.id);

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
