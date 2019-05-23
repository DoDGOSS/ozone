import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, ButtonGroup, Divider, Tooltip, Intent, Popover, Position } from "@blueprintjs/core";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { widgetTypeApi } from "../../../../api/clients/WidgetTypeAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";

import { GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";
import { EditMenu } from "./export/EditMenu"
import { ExportDialog } from "./export/ExportDialog";
import { ExportErrorDialog } from "./export/ExportErrorDialog";
import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { WidgetSetup } from "./WidgetSetup";

interface WidgetsWidgetState {
    widgets: WidgetDTO[];
    loading: boolean;
    showTable: boolean;
    showWidgetSetup: boolean;
    updatingWidget: WidgetDTO | undefined;
    widgetTypes: WidgetTypeReference[];
    exportDialog: React.Component | undefined;
    exportErrorDialog: React.Component | undefined;
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
                {this.state.exportDialog}
                {this.state.exportErrorDialog}
                {showTable && (
                    <div>
                        <GenericTable
                            items={this.state.widgets}
                            getColumns={this.columns}
                            reactTableProps={{
                                defaultPageSize: this.defaultPageSize
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
                            <EditButton
                                itemName={row.original.value.namespace}
                                onClick={() => {
                                    this.setState({ updatingWidget: row.original });
                                    this.showSubSection(WidgetWidgetSubSection.SETUP);
                                }}
                            />
                            <Popover content={this.renderEditMenu(row.original)}
                              position={Position.BOTTOM_RIGHT}>
                              <Button
                                rightIcon="caret-down"
                                intent={Intent.PRIMARY}
                              />
                            </Popover>
                            <Divider />
                            <Tooltip
                                disabled={!this.widgetPotentiallyInUse(row.original)}
                                content={"Can't delete widget with assigned users or groups"}
                            >
                                <DeleteButton
                                    itemName={row.original.value.namespace}
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
        if (response.status !== 200) return false;

        this.handleUpdate();

        return true;
    };

    private renderEditMenu = (widget: WidgetDTO) => {
      return (<EditMenu openExportDialog={() => this.setState({exportDialog: this.renderExportDialog(widget)})} />);
    }

    private renderExportDialog = (widget: WidgetDTO) => {
      return (<ExportDialog
        widget={widget}
        onClose={() => this.setState({exportDialog: undefined})}
        openExportErrorDialog={() => this.setState({exportErrorDialog: this.renderExportErrorDialog(widget)})}
      />);
    }

    private renderExportErrorDialog = (widget: WidgetDTO) => {
      return (<ExportErrorDialog
        widget={widget}
        onClose={() => this.setState({exportErrorDialog: undefined})}
      />);
    }
}
