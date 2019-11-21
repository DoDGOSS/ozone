import * as React from "react";

import { Button, Intent, Position, Toaster } from "@blueprintjs/core";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { UserDTO } from "../../../../api/models/UserDTO";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { UserWidgetsEditDialog } from "./UserWidgetsEditDialog";
import { WidgetTable } from "../Widgets/WidgetTable";

import * as styles from "../Widgets.scss";
import { ListOf, Response } from "../../../../api/interfaces";
import { userWidgetApi } from "../../../../api/clients/UserWidgetAPI";

interface UserEditWidgetsProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditWidgetsState {
    widgets: WidgetDTO[];
    loading: boolean;
    showAdd: boolean;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export class UserWidgetsPanel extends React.Component<UserEditWidgetsProps, UserEditWidgetsState> {
    defaultPageSize: number = 5;

    constructor(props: UserEditWidgetsProps) {
        super(props);
        this.state = {
            widgets: [],
            loading: true,
            showAdd: false
        };
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
                    onSubmit={this.addWidgets}
                    onClose={this.closeWidgetDialog}
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

        const response: any = await userWidgetApi.getUserWidgets(currentUser.id);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return;

        this.setState({
            widgets: response.data.data,
            loading: false
        });
    };

    private addWidgets = async (widgets: Array<WidgetDTO>) => {
        const responses = [];
        for (const widget of widgets) {
            if (this.state.widgets.findIndex((w) => w.id === widget.id) >= 0) {
                continue;
            }
            const response: Response<ListOf<WidgetDTO[]>> = await widgetApi.addWidgetUsers(
                widget.id,
                this.props.user.id
            );
            if (response.status >= 200 && response.status < 400) {
                OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
            } else {
                OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
                return;
            }

            responses.push(response.data.data);
        }

        this.setState({
            showAdd: false
        });

        this.getWidgets();
        this.props.onUpdate(responses);

        return responses;
    };

    private closeWidgetDialog = () => {
        this.setState({
            showAdd: false
        });
    };

    private confirmDeleteWidget = async (widget: WidgetDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove widget ",
                { text: widget.value.namespace, style: "bold" },
                " from user ",
                { text: this.props.user.userRealName, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeWidget(widget)
        });
        return true;
    };

    private removeWidget = async (widget: WidgetDTO) => {
        const response: Response<void> = await widgetApi.removeWidgetUsers(widget.value.id, this.props.user.id);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return false;

        this.getWidgets();
        this.props.onUpdate();

        return true;
    };
}
