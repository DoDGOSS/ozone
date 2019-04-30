import * as React from "react";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";

import { isNil } from "../../../../utility";

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
                columns={[
                    { Header: "Title", accessor: "value.namespace" },
                    { Header: "URL", accessor: "value.url" },
                    { Header: "Users", accessor: "value.totalUsers" },
                    { Header: "Groups", accessor: "value.totalGroups" }
                ]}
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }

    protected async getAllWidgets(): Promise<Array<WidgetDTO>> {
        const response = await widgetApi.getWidgets();

        if (response.status !== 200) return [];

        return response.data.data;
    }
}
