import { TableSelectionDialog, TableSelectionDialogProps } from "../../../table-selection-dialog/TableSelectionDialog";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserDTO } from "../../../../api/models/UserDTO";

export class GroupUsersEditDialog extends TableSelectionDialog<UserDTO> {
    constructor(props: TableSelectionDialogProps<UserDTO>) {
        super(props);
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
