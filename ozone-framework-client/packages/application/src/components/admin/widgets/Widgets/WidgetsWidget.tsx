import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, ButtonGroup, Divider, InputGroup, Intent, Tooltip } from "@blueprintjs/core";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { widgetTypeApi } from "../../../../api/clients/WidgetTypeAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";

import { GenericTable } from "../../table/GenericTable";
import { inPlaceConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { WidgetSetup } from "./WidgetSetup";

import { isNil } from "../../../../utility";

interface WidgetsWidgetState {
    widgets: WidgetDTO[];
    filtered: WidgetDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    showTable: boolean;
    showWidgetSetup: boolean;
    updatingWidget: any | undefined;
    widgetTypes: WidgetTypeReference[];
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Error handling for form

enum WidgetWidgetSubSection {
    TABLE,
    SETUP
}

export class WidgetsWidget extends React.Component<{}, WidgetsWidgetState> {
    constructor(props: any) {
        super(props);

        this.state = {
            widgets: [],
            widgetTypes: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 15,
            showTable: true,
            showWidgetSetup: false,
            updatingWidget: undefined
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.columns = this.columns.bind(this);
    }

    componentDidMount() {
        this.getWidgets();
        this.getWidgetTypes();
    }

    render() {
        const showTable = this.state.showTable;
        const showWidgetSetup = this.state.showWidgetSetup;

        return (
            <div data-element-id="widget-admin-widget-dialog">
                {showTable && (
                    <div>
                        <GenericTable
                            title={""}
                            items={this.state.widgets}
                            getColumns={this.columns}
                            pageSize={this.state.pageSize}
                        />
                        <div className={styles.buttonBar}>
                            <Button
                                text="Create"
                                onClick={() => {
                                    this.setState({ updatingWidget: undefined });
                                    this.showSubSection(WidgetWidgetSubSection.SETUP);
                                }}
                                data-element-id="widget-admin-widget-create-button"
                            />
                        </div>
                    </div>
                )}

                {showWidgetSetup && (
                    <div className={styles.widget_body}>
                        <WidgetSetup
                            widget={this.state.updatingWidget}
                            widgetTypes={this.state.widgetTypes}
                            closeSetup={() => {
                                this.handleUpdate();
                                this.showSubSection(WidgetWidgetSubSection.TABLE);
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }

    private columns = () => {
        return [
            { Header: "Title", id: "title", accessor: (widget: WidgetDTO) => widget.value.namespace },
            { Header: "URL", id: "url", accessor: (widget: WidgetDTO) => widget.value.url },
            { Header: "Users", id: "users", accessor: (widget: WidgetDTO) => widget.value.totalUsers },
            { Header: "Groups", id: "groups", accessor: (widget: WidgetDTO) => widget.value.totalGroups },
            // TODO - Abstract this to only have to provide onclick function name with styled buttons
            {
                Header: "Actions",
                Cell: (row: { original: WidgetDTO }) => (
                    <div>
                        <ButtonGroup>
                            <Button
                                data-element-id="widget-admin-widget-edit-button"
                                data-widget-title={row.original.value.namespace}
                                text="Edit"
                                intent={Intent.PRIMARY}
                                icon="edit"
                                small={true}
                                onClick={() => {
                                    this.setState({ updatingWidget: row.original });
                                    this.showSubSection(WidgetWidgetSubSection.SETUP);
                                }}
                            />
                            <Divider />
                            <Tooltip
                                content={
                                    this.widgetPotentiallyInUse(row.original)
                                        ? "Can't delete widget with assigned users or groups"
                                        : ""
                                }
                            >
                                <Button
                                    data-element-id="widget-admin-widget-delete-button"
                                    data-widget-title={row.original.value.namespace}
                                    text={"Delete"}
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    disabled={this.widgetPotentiallyInUse(row.original)}
                                    onClick={() => this.confirmAndDeleteWidget(row.original)}
                                />
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                )
            }
        ];
    };

    private widgetPotentiallyInUse(widget: WidgetDTO): boolean {
        return widget.value.totalUsers > 0 || widget.value.totalGroups > 0;
    }

    private showSubSection(subSection: WidgetWidgetSubSection) {
        this.setState({
            showTable: subSection === WidgetWidgetSubSection.TABLE,
            showWidgetSetup: subSection === WidgetWidgetSubSection.SETUP
        });
    }

    private getWidgets = async () => {
        const response = await widgetApi.getWidgets();
        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgets: response.data.data,
            loading: false
        });
    };

    private getWidgetTypes = async () => {
        const response = await widgetTypeApi.getWidgetTypes();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgetTypes: response.data.data
        });
    };

    private handleUpdate(update?: any) {
        this.getWidgets();
    }

    private confirmAndDeleteWidget = (widgetToRemove: WidgetDTO): void => {
        console.log(widgetToRemove);
        inPlaceConfirmationDialog({
            title: "Warning",
            message: `This action will permanently <strong>${widgetToRemove.value.namespace}</strong>`,
            onConfirm: () => this.deleteWidget(widgetToRemove)
        });
    };

    private deleteWidget = async (widget: WidgetDTO) => {
        const response = await widgetApi.deleteWidget(widget.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.handleUpdate();

        return true;
    };
}
