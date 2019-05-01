import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";

export class GroupUsersEditDialog extends React.Component<SelectionDialogProps<UserDTO>> {
    constructor(props: SelectionDialogProps<UserDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add User(s) to Group"
                show={this.props.show}
                getItems={this.getAllUsers}
                columns={[
                    { Header: "Name", accessor: "userRealName" },
                    { Header: "Username", accessor: "username" },
                    { Header: "Email", accessor: "email" },
                    { Header: "Groups", accessor: "totalGroups" },
                    { Header: "Widgets", accessor: "totalWidgets" },
                    { Header: "Dashboards", accessor: "totalDashboards" },
                    { Header: "Last Login", accessor: "lastLogin" }
                ]}
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }

    protected async getAllUsers(): Promise<Array<UserDTO>> {
        const response = await userApi.getUsers();

        if (response.status !== 200) return [];

        return response.data.data;
    }
}
