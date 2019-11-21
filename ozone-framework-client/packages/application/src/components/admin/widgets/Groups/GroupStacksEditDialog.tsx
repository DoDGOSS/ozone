import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";
import { ColumnTabulator } from "../../../generic-table/GenericTable";

export class GroupStacksEditDialog extends React.Component<SelectionDialogProps<StackDTO>> {
    constructor(props: SelectionDialogProps<StackDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add Stack(s) to Group"
                show={this.props.show}
                getItems={this.getAllStacks}
                columns={
                    [
                        { title: "Title", field: "name" },
                        { title: "Dashboards", field: "totalDashboards" },
                        { title: "Widgets", field: "totalWidgets" },
                        { title: "Groups", field: "totalGroups" },
                        { title: "Users", field: "totalUsers" }
                    ] as ColumnTabulator[]
                }
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }

    protected async getAllStacks(): Promise<Array<StackDTO>> {
        const response = await stackApi.getStacksAsAdmin();

        if (!(response.status >= 200 && response.status < 400)) return [];

        return response.data.data.filter((stack) => stack.approved);
    }
}
