import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";

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
                columns={[
                    { Header: "Title", accessor: "name" },
                    { Header: "Pages (Dashboards)", accessor: "totalDashboards" },
                    { Header: "Widgets", accessor: "totalWidgets" },
                    { Header: "Groups", accessor: "totalGroups" },
                    { Header: "Users", accessor: "totalUsers" }
                ]}
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }

    protected async getAllStacks(): Promise<Array<StackDTO>> {
        const response = await stackApi.getStacks();

        if (response.status !== 200) return [];

        return response.data.data;
    }
}
