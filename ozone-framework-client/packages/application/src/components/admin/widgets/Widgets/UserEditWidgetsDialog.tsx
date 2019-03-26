import { TableSelectionDialog, TableSelectionDialogProps } from "../../../table-selection-dialog/TableSelectionDialog";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { widgetApi } from "../../../../api/clients/WidgetAPI";

export class UserEditWidgetsDialog extends TableSelectionDialog<WidgetDTO> {
    constructor(props: TableSelectionDialogProps<WidgetDTO>) {
        super(props);
    }

    protected async dataLoader(): Promise<Array<WidgetDTO>> {
        const response = await widgetApi.getWidgets();

        if (response.status !== 200) return [];

        return response.data.data;
    }

    protected filterMatch(filter: string, widget: WidgetDTO): boolean {
        return (
            widget.value.namespace.toLowerCase().includes(filter) ||
            widget.value.description.toLowerCase().includes(filter) ||
            widget.value.universalName.toLowerCase().includes(filter)
        );
    }

    protected selectionMatch(selectedRow: WidgetDTO, value: WidgetDTO): boolean {
        return selectedRow.id === value.id;
    }
}
