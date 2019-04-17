import { TableSelectionDialog, TableSelectionDialogProps } from "../../../table-selection-dialog/TableSelectionDialog";
import { WidgetAPI } from "../../../../api/clients/WidgetApi";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

export class GroupUsersEditDialog extends TableSelectionDialog<WidgetDTO> {
    constructor(props: TableSelectionDialogProps<WidgetDTO>) {
        super(props);
    }

z
    protected async dataLoader(): Promise<Array<WidgetDTO>> {
        const response = await WidgetAPI.getWidgets();

        if (response.status !== 200) return [];

        return response.data.data;
    }

    protected filterMatch(filter: string, value: WidgetDTO): boolean {
        return (
            value.namespace.toLowerCase().includes(filter)
        );
    }

    protected selectionMatch(selectedRow: WidgetDTO, value: WidgetDTO): boolean {
        return selectedRow.id === value.id;
    }
}
