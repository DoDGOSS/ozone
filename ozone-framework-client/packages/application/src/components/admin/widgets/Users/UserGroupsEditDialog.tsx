import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { GroupDTO } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";
import { ColumnTabulator } from "../../../generic-table/GenericTable";

export class UserGroupsEditDialog extends React.Component<SelectionDialogProps<GroupDTO>> {
    constructor(props: SelectionDialogProps<GroupDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add User to Group(s)"
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

        if (!(response.status >= 200 && response.status < 400)) return [];

        return response.data.data;
    }
}
