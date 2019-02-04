import { observer } from "mobx-react";

import { UserAPI, UserDTO } from '../../../../api';
import { lazyInject } from '../../../../inject';

import { TableSelectionDialog, TableSelectionDialogProps } from '../../../table-selection-dialog/TableSelectionDialog';

@observer
export class GroupEditUsersDialog extends TableSelectionDialog<UserDTO> {
    
    @lazyInject(UserAPI)
    private userAPI: UserAPI;

    constructor(props: TableSelectionDialogProps<UserDTO>) {
        super(props);
    }
    protected async dataLoader(): Promise<Array<UserDTO>> {
        const response = await this.userAPI.getUsers();

        if (response.status !== 200) return [];

        return response.data.data;
    }
    
    protected filterMatch(filter: string, value: UserDTO): boolean {
        return  value.userRealName.toLowerCase().includes(filter)
                ||
                value.email.toLowerCase().includes(filter)
                ||
                value.username.toLowerCase().includes(filter);
    }
    
    protected selectionMatch(selectedRow: UserDTO, value: UserDTO): boolean {
        return selectedRow.id === value.id;
    }
}
