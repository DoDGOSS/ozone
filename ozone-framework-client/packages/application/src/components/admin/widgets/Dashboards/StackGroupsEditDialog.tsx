import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { GroupDTO } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";
import { ColumnTabulator } from "../../../generic-table/GenericTable";

export class StackGroupsEditDialog extends React.Component<SelectionDialogProps<GroupDTO>> {
    constructor(props: SelectionDialogProps<GroupDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add Group(s) to Stack"
                show={this.props.show}
                getItems={this.getAllGroups}
                columns={
                    [
                        { title: "Group Name", field: "name" },
                        { title: "Users", field: "totalUsers" },
                        { title: "Widgets", field: "totalWidgets" },
                        { title: "Dashboards", field: "totalDashboards" }
                    ] as ColumnTabulator[]
                }
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }

    protected async getAllGroups(): Promise<Array<GroupDTO>> {
        const response = await groupApi.getGroups();

        if (response.status !== 200) return [];

        return response.data.data;
    }
}
