import * as React from "react";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { ColumnTabulator } from "../../../generic-table/GenericTable";

export class GroupWidgetsEditDialog extends React.Component<SelectionDialogProps<WidgetDTO>> {
    constructor(props: SelectionDialogProps<WidgetDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add Widget(s) to Group"
                show={this.props.show}
                getItems={this.getAllWidgets}
                columns={
                    [
                        { title: "Title", field: "value.namespace" },
                        { title: "URL", field: "value.url" },
                        { title: "Users", field: "value.totalUsers" },
                        { title: "Groups", field: "value.totalGroups" }
                    ] as ColumnTabulator[]
                }
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }

    protected async getAllWidgets(): Promise<Array<WidgetDTO>> {
        const response = await widgetApi.getWidgets();

        if (!(response.status >= 200 && response.status < 400)) return [];

        return response.data.data;
    }
}
