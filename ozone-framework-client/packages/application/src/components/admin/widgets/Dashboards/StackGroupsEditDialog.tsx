import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { GroupDTO } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";

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
                columns={[
                    { Header: "Group Name", id: "name", accessor: (stack: StackDTO) => stack.name },
                    { Header: "Users", id: "totalUsers", accessor: (stack: StackDTO) => stack.totalUsers },
                    { Header: "Widgets", id: "totalWidgets", accessor: (stack: StackDTO) => stack.totalWidgets },
                    {
                        Header: "Dashboards",
                        id: "totalDashboards",
                        accessor: (stack: StackDTO) => stack.totalDashboards
                    }
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
