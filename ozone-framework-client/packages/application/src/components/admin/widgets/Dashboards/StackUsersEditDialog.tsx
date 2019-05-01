import * as React from "react";

import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";

export class StackUsersEditDialog extends React.Component<SelectionDialogProps<UserDTO>> {
    constructor(props: SelectionDialogProps<UserDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add User(s) to Stack"
                show={this.props.show}
                getItems={this.getAllUsers}
                columns={[
                    { Header: "Name", id: "name", accessor: (user: UserDTO) => user.userRealName },
                    { Header: "Username", id: "username", accessor: (user: UserDTO) => user.username },
                    { Header: "Email", id: "email", accessor: (user: UserDTO) => user.email },
                    { Header: "Stacks", id: "totalStacks", accessor: (user: UserDTO) => user.totalStacks },
                    { Header: "Widgets", id: "totalWidgets", accessor: (user: UserDTO) => user.totalWidgets },
                    { Header: "Dashboards", id: "totalDashboards", accessor: (user: UserDTO) => user.totalDashboards },
                    { Header: "Last Login", id: "lastLogin", accessor: (user: UserDTO) => user.lastLogin }
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
