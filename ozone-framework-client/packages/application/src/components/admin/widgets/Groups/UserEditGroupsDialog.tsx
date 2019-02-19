import { observer } from "mobx-react";

import { GroupAPI, GroupDTO } from "../../../../api";
import { lazyInject } from "../../../../inject";

import { TableSelectionDialog, TableSelectionDialogProps } from "../../../table-selection-dialog/TableSelectionDialog";

@observer
export class UserEditGroupsDialog extends TableSelectionDialog<GroupDTO> {
    @lazyInject(GroupAPI)
    private groupAPI: GroupAPI;

    constructor(props: TableSelectionDialogProps<GroupDTO>) {
        super(props);
    }
    protected async dataLoader(): Promise<Array<GroupDTO>> {
        const response = await this.groupAPI.getGroups();

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
