import * as React from "react";

import { Button, ButtonGroup, Divider, InputGroup, Intent } from "@blueprintjs/core";
import { AdminTable } from "../../table/AdminTable";

import * as uuidv4 from "uuid/v4";

import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { WidgetCreateRequest, WidgetDTO } from "../../../../api/models/WidgetDTO";
import { widgetApi } from "../../../../api/clients/WidgetAPI";

import * as styles from "../Widgets.scss";
import { WidgetCreateForm } from "./WidgetCreateForm";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { widgetTypeApi } from "../../../../api/clients/WidgetTypeAPI";
import { isNil } from "../../../../utility";
import { WidgetSetup } from './WidgetSetup'

interface State {
    widgets: WidgetDTO[];
    filtered: WidgetDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showWidgetSetup: boolean,
    showEditGroup: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageWidget: WidgetDTO | undefined;
    updatingWidget: any | undefined;
    widgetTypes: WidgetTypeReference[];
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Popup warning dialogue for deleting
// Error handling for form

enum WidgetWidgetSubSection {
    TABLE,
    CREATE,
    SETUP,
    EDIT
}

export class WidgetsWidget extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            widgets: [],
            widgetTypes: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 25,
            showTable: true,
            showWidgetSetup: false,
            showEditGroup: false,
            showDelete: false,
            confirmationMessage: "",
            manageWidget: undefined,
            updatingWidget: undefined,
            columns: [
                {
                    Header: "Widgets",
                    columns: [
                        { Header: "Title", accessor: "value.namespace" },
                        { Header: "URL", accessor: "value.url" },
                        { Header: "Users", accessor: "value.totalUsers" },
                        { Header: "Groups", accessor: "value.totalGroups" }
                    ]
                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => (
                        <div>
                            <ButtonGroup>
                                <Button
                                    data-element-id="widget-admin-widget-edit-button"
                                    text="Edit"
                                    intent={Intent.PRIMARY}
                                    icon="edit"
                                    small={true}
                                    onClick={() => {
                                        this.showSubSection(WidgetWidgetSubSection.SETUP);
                                        this.setState({ updatingWidget: row.original });
                                    }}
                                />
                                <Divider />
                                <Button
                                    data-element-id="widget-admin-widget-delete-button"
                                    text="Delete"
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    disabled={row.original.totalStacks > 0}
                                    onClick={() => this.deleteWidget(row.original)}
                                />
                            </ButtonGroup>
                        </div>
                    )
                }
            ]
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getWidgets();
        this.getWidgetTypes();
    }

    render() {
        const showTable = this.state.showTable;
        const showWidgetSetup = this.state.showWidgetSetup;

        let widgets = this.state.widgets;
        const filter = this.state.filter.toLowerCase();

        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            widgets = widgets.filter((row) => {
            const { universalName, namespace } = row.value;
                return (
                    (!isNil(universalName) && universalName.toLowerCase().includes(filter)) ||
                    (!isNil(namespace) && namespace.toLowerCase().includes(filter))
                );
            });
        }

        return (
            <div data-element-id="widget-admin-widget-dialog">
                {showTable && (
                    <div className={styles.actionBar}>
                        <InputGroup
                            placeholder="Search..."
                            leftIcon="search"
                            value={this.state.filter}
                            onChange={(e: any) => this.setState({ filter: e.target.value })}
                            data-element-id="search-field"
                        />
                    </div>
                )}

                {showTable && (
                    <div className={styles.table}>
                        <AdminTable
                            data={widgets}
                            columns={this.state.columns}
                            loading={this.state.loading}
                            pageSize={this.state.pageSize}
                        />
                    </div>
                )}

                {showTable && (
                    <div className={styles.buttonBar}>
                        <Button
                            text="Create"
                            onClick={() => {
                                this.showSubSection(WidgetWidgetSubSection.SETUP);
                                this.setState({ updatingWidget: undefined });
                            }}
                            data-element-id="widget-admin-widget-create-button"
                        />
                    </div>
                )}


                <div className={styles.widget_body}>
                    {showWidgetSetup && (
                        <WidgetSetup
                            updatingWidget={this.state.updatingWidget}
                            widgetTypes={this.state.widgetTypes}
                            closeSetup={() => {
                                this.handleUpdate();
                                this.showSubSection(WidgetWidgetSubSection.TABLE);
                            }}
                        />
                    )}
                </div>

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

    private showSubSection(subSection: WidgetWidgetSubSection) {
        this.setState({
            showTable: subSection === WidgetWidgetSubSection.TABLE,
            // showCreate: subSection === WidgetWidgetSubSection.CREATE,
            showWidgetSetup: subSection === WidgetWidgetSubSection.SETUP,
            showEditGroup: subSection === WidgetWidgetSubSection.EDIT
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

    private deleteWidget = async (widget: WidgetDTO) => {
        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${widget.value.namespace}</strong>`,
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

        const response = await widgetApi.deleteWidget(widget.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getWidgets();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageWidget: undefined
        });
    };
}
