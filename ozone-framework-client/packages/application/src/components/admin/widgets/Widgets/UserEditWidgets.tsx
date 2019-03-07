import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";
import { UserEditWidgetsDialog } from "./UserEditWidgetsDialog";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { UserDTO } from "../../../../api/models/UserDTO";
import { widgetApi, WidgetQueryCriteria } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO, WidgetUpdateRequest } from "../../../../api/models/WidgetDTO";

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

export class UserEditWidgets extends React.Component<UserEditWidgetsProps, UserEditWidgetsState> {
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
    private readonly WIDGETS_COLUMN_DEFINITION = [
        {
            Header: "Widgets",
            columns: [
                { Header: "Title", accessor: "value.namespace" },
                { Header: "URL", accessor: "value.url" },
                { Header: "Users", accessor: "value.totalUsers" },
                { Header: "Groups", accessor: "value.totalGroups" }
            ]
        },
        {
            Header: "Actions",
            Cell: (row: any) => (
                <div>
                    <ButtonGroup>
                        <Button
                            data-element-id="user-admin-widget-delete-widget-button"
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

                <div className={styles.table}>
                    <AdminTable
                        data={data}
                        columns={this.WIDGETS_COLUMN_DEFINITION}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="user-edit-add-widget-dialog-add-button"
                    />
                </div>

                <UserEditWidgetsDialog
                    show={this.state.showAdd}
                    title="Add Widget(s) to User"
                    confirmHandler={this.handleAddWidgetResponse}
                    cancelHandler={this.handleAddWidgetCancel}
                    columns={UserEditWidgets.SELECT_WIDGETS_COLUMN_DEFINITION}
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
        // const responses = await Promise.all(widgets.map( async (widget: WidgetDTO) => {
        const responses = [];
        for (const widget of widgets) {
            // const request: WidgetUpdateRequest = {
            //     id: widget.id,
            //     name: widget.name,
            //     update_action: "add",
            //     user_ids: [
            // };

            const response = await widgetApi.addWidgetUsers(widget.id, this.state.user.id);
            console.log(response.data.data);

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
        //
        // const request: WidgetUpdateRequest = {
        //     id: widget.id,
        //     name: widget.name,
        //     update_action: "remove",
        //     user_ids: [this.state.user.id]
        // };

        const response = await widgetApi.removeWidgetUsers(widget.id, this.state.user.id);

        console.log(response);

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
