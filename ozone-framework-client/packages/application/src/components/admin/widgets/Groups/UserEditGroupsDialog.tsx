import { TableSelectionDialog, TableSelectionDialogProps } from "../../../table-selection-dialog/TableSelectionDialog";
import { GroupDTO } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";

export class UserEditGroupsDialog extends TableSelectionDialog<GroupDTO> {
    constructor(props: TableSelectionDialogProps<GroupDTO>) {
        super(props);
    }

    protected async dataLoader(): Promise<Array<GroupDTO>> {
        const response = await groupApi.getGroups();

        if (response.status !== 200) return [];

        return response.data.data;
    }

    protected filterMatch(filter: string, value: GroupDTO): boolean {
        return value.name.toLowerCase().includes(filter);
    }

    protected selectionMatch(selectedRow: GroupDTO, value: GroupDTO): boolean {
        return selectedRow.id === value.id;
    }
}
