import { TableSelectionDialog, TableSelectionDialogProps } from "../../../table-selection-dialog/TableSelectionDialog";
import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

export class GroupWidgetsEditDialog extends TableSelectionDialog<WidgetDTO> {
    constructor(props: TableSelectionDialogProps<WidgetDTO>) {
        super(props);
    }

    protected async dataLoader(): Promise<Array<WidgetDTO>> {
        const response = await widgetApi.getWidgets();

        if (response.status !== 200) return [];
        console.log(response.data.data)
        return response.data.data;
    }

    protected filterMatch(filter: string, value: WidgetDTO): boolean {
        return (
            value.namespace.toLowerCase().includes(filter) ||
            value.description.toLowerCase().includes(filter) ||
            value.widgetUrl.toLowerCase().includes(filter)
        );
    }

    protected selectionMatch(selectedRow: WidgetDTO, value: WidgetDTO): boolean {
        return selectedRow.id === value.id;
    }
}
