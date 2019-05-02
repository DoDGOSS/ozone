import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";
import React from "react";

export class StackUsersEditDialog extends React.Component<SelectionDialogProps<UserDTO>> {
    constructor(props: SelectionDialogProps<UserDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add Users(s) to Stack"
                show={this.props.show}
                getItems={this.dataLoader}
                columns={[
                    { Header: "Name", id: "userRealName", accessor: (user: UserDTO) => user.userRealName },
                    { Header: "UserName", id: "username", accessor: (user: UserDTO) => user.username },
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

    protected async dataLoader(): Promise<Array<UserDTO>> {
        const response = await userApi.getUsers();

        if (response.status !== 200) return [];

        return response.data.data;
    }

    protected filterMatch(filter: string, value: UserDTO): boolean {
        return (
            value.userRealName.toLowerCase().includes(filter) ||
            value.email.toLowerCase().includes(filter) ||
            value.username.toLowerCase().includes(filter)
        );
    }

    protected selectionMatch(selectedRow: UserDTO, value: UserDTO): boolean {
        return selectedRow.id === value.id;
    }
}
