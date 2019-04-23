import * as React from "react";

import { Button, InputGroup } from "@blueprintjs/core";
import { Column } from "react-table";

import { widgetApi, WidgetQueryCriteria } from "../../../../api/clients/WidgetAPI";
import { UserDTO } from "../../../../api/models/UserDTO";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { UserWidgetsEditDialog } from "./UserWidgetsEditDialog";
import { WidgetTable } from "../Widgets/WidgetTable";

import * as styles from "../Widgets.scss";

interface UserEditWidgetsProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditWidgetsState {
    widgets: WidgetDTO[];
    loading: boolean;
    showAdd: boolean;
}

export class UserWidgetsPanel extends React.Component<UserEditWidgetsProps, UserEditWidgetsState> {
    defaultPageSize: number = 5;

    constructor(props: UserEditWidgetsProps) {
        super(props);
        this.state = {
            widgets: [],
            loading: true,
            showAdd: false
        };

        this.confirmDeleteWidget = this.confirmDeleteWidget.bind(this);
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
                    onDelete={this.confirmDeleteWidget}
                    defaultPageSize={this.defaultPageSize}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.showAdd()}
                        data-element-id="user-edit-add-widget-dialog-add-button"
                    />
                </div>

                <UserWidgetsEditDialog
                    show={this.state.showAdd}
                    title="Add Widget(s) to User"
                    confirmHandler={this.handleAddWidgetResponse}
                    cancelHandler={this.handleAddWidgetCancel}
                    columns={this.getDialogColumns()}
                />
            </div>
        );
    }

    private showAdd() {
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
            if (this.state.widgets.findIndex((w) => w.id === widget.id) >= 0) {
                continue;
            }
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

    private confirmDeleteWidget = async (widget: WidgetDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message:
                "This action will remove widget " +
                widget.value.namespace +
                " from user " +
                this.props.user.userRealName +
                ".",
            onConfirm: () => this.removeWidget(widget)
        });
        return true;
    };

    private removeWidget = async (widget: WidgetDTO) => {
        const response = await widgetApi.removeWidgetUsers(widget.id, this.props.user.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getWidgets();
        this.props.onUpdate();

        return true;
    };

    private getDialogColumns(): Column[] {
        return [
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
    }
}
