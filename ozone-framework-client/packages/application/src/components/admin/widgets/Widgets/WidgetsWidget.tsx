import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, ButtonGroup, Divider, Intent, Popover, Position, Tooltip } from "@blueprintjs/core";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { widgetTypeApi } from "../../../../api/clients/WidgetTypeAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTypeDTO, WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";
import { EditMenu } from "./export/EditMenu";
import { ExportDialog } from "./export/ExportDialog";
import { ExportErrorDialog } from "./export/ExportErrorDialog";
import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { WidgetSetup } from "./WidgetSetup";
import { ListOf, Response } from "../../../../api/interfaces";

interface WidgetsWidgetState {
    widgets: WidgetDTO[];
    loading: boolean;
    showTable: boolean;
    showWidgetSetup: boolean;
    updatingWidget: WidgetDTO | undefined;
    widgetTypes: WidgetTypeReference[];
    exportDialog: any;
    exportErrorDialog: any;
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
    defaultPageSize: number = 15;
    _isMounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            widgets: [],
            widgetTypes: [],
            loading: true,
            showTable: true,
            showWidgetSetup: false,
            updatingWidget: undefined,
            exportDialog: undefined,
            exportErrorDialog: undefined
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getWidgets();
        this.getWidgetTypes();
    }

    render() {
        const showTable = this.state.showTable;
        const showWidgetSetup = this.state.showWidgetSetup;

        return (
            <div data-element-id="widget-admin-widget-dialog">
                {this.state.exportDialog}
                {this.state.exportErrorDialog}
                {showTable && (
                    <div>
                        <GenericTable
                            items={this.state.widgets}
                            getColumns={this.columns}
                            tableProps={{
                                paginationSize: this.defaultPageSize
                            }}
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
                            onUpdate={() => this.handleUpdate()}
                            onClose={() => {
                                this.handleUpdate();
                                this.showSubSection(WidgetWidgetSubSection.TABLE);
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    private columns = () => {
        return [
            { title: "Title", field: "value.namespace" },
            { title: "URL", field: "value.url" },
            { title: "Users", field: "value.totalUsers" },
            { title: "Groups", field: "value.totalGroups" },
            // TODO - Abstract this to only have to provide onclick function name with styled buttons
            {
                title: "Actions",
                width: 180,
                responsive: 0,
                formatter: (row: any) => {
                    const data: WidgetDTO = row.cell._cell.row.data;
                    return (
                        <div>
                            <ButtonGroup>
                                <EditButton
                                    itemName={data.value.namespace}
                                    onClick={() => {
                                        this.setState({ updatingWidget: data });
                                        this.showSubSection(WidgetWidgetSubSection.SETUP);
                                    }}
                                />
                                <Popover content={this.renderEditMenu(data)} position={Position.BOTTOM_RIGHT}>
                                    <Button
                                        data-element-id="edit-menu-button"
                                        data-widget-title={data.value.namespace ? data.value.namespace : ""}
                                        rightIcon="caret-down"
                                        intent={Intent.PRIMARY}
                                        small={true}
                                    />
                                </Popover>
                                <Divider />
                                <Tooltip
                                    disabled={!this.widgetPotentiallyInUse(data)}
                                    content={"Can't delete widget with assigned users or groups"}
                                >
                                    <DeleteButton
                                        itemName={data.value.namespace}
                                        disabled={this.widgetPotentiallyInUse(data)}
                                        onClick={() => this.confirmAndDeleteWidget(data)}
                                    />
                                </Tooltip>
                            </ButtonGroup>
                        </div>
                    );
                }
            }
        ] as ColumnTabulator[];
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
        if (!(response.status >= 200 && response.status < 400)) return;

        if (!this._isMounted) {
            return;
        }
        this.setState({
            widgets: response.data.data,
            loading: false
        });
    };

    private getWidgetTypes = async () => {
        const response: Response<ListOf<WidgetTypeDTO[]>> = await widgetTypeApi.getWidgetTypes();

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return;

        if (!this._isMounted) {
            return;
        }

        this.setState({
            widgetTypes: response.data.data
        });
    };

    private handleUpdate = (update?: any) => {
        this.getWidgets();
    };

    private confirmAndDeleteWidget = (widgetToRemove: WidgetDTO): void => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will permanently delete ",
                { text: widgetToRemove.value.namespace, style: "bold" },
                "."
            ],
            onConfirm: () => this.deleteWidget(widgetToRemove)
        });
    };

    private deleteWidget = async (widget: WidgetDTO) => {
        const response = await widgetApi.deleteWidget(widget.id);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return false;

        this.handleUpdate();

        return true;
    };

    private renderEditMenu = (widget: WidgetDTO) => {
        return <EditMenu openExportDialog={() => this.setState({ exportDialog: this.renderExportDialog(widget) })} />;
    };

    private renderExportDialog = (widget: WidgetDTO) => {
        return (
            <ExportDialog
                widget={widget}
                onClose={() => this.setState({ exportDialog: undefined })}
                openExportErrorDialog={() => this.setState({ exportErrorDialog: this.renderExportErrorDialog(widget) })}
            />
        );
    };

    private renderExportErrorDialog = (widget: WidgetDTO) => {
        return <ExportErrorDialog widget={widget} onClose={() => this.setState({ exportErrorDialog: undefined })} />;
    };
}
