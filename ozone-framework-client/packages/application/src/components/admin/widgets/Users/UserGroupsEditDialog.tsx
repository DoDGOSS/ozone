import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { GroupDTO } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";

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
                columns={[
                    { Header: "Group Name", accessor: "name" },
                    { Header: "Users", accessor: "totalUsers" },
                    { Header: "Widgets", accessor: "totalWidgets" },
                    { Header: "Dashboards", accessor: "totalDashboards" }
                ]}
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
