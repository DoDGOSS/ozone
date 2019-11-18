import { SelectionDialogProps, TableSelectionDialog } from "../../../table-selection-dialog/TableSelectionDialog";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";
import React from "react";
import { ColumnTabulator } from "../../../generic-table/GenericTable";

export class StackUsersEditDialog extends React.Component<SelectionDialogProps<UserDTO>> {
    constructor(props: SelectionDialogProps<UserDTO>) {
        super(props);
    }

    render() {
        return (
            <TableSelectionDialog
                title="Add User(s) to Stack"
                show={this.props.show}
                getItems={this.dataLoader}
                columns={
                    [
                        { title: "Name", field: "userRealName" },
                        { title: "UserName", field: "username" },
                        { title: "Email", field: "email" }
                    ] as ColumnTabulator[]
                }
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }

    protected async dataLoader(): Promise<Array<UserDTO>> {
        const response = await userApi.getUsers();

        if (!(response.status >= 200 && response.status < 400)) return [];

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
