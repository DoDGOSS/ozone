import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";

import { TableSelectionDialog, TableSelectionDialogProps } from "../../../table-selection-dialog/TableSelectionDialog";

import { isNil } from "../../../../utility";

export class GroupWidgetsEditDialog extends TableSelectionDialog<WidgetDTO> {
    constructor(props: TableSelectionDialogProps<WidgetDTO>) {
        super(props);
    }

    protected async dataLoader(): Promise<Array<WidgetDTO>> {
        const response = await widgetApi.getWidgets();

        if (response.status !== 200) return [];

        return response.data.data;
    }

    protected filterMatch(filter: string, widget: WidgetDTO): boolean {
        const { namespace, description, universalName } = widget.value;

        return (
            namespace.toLowerCase().includes(filter) ||
            (!isNil(description) && description.toLowerCase().includes(filter)) ||
            (!isNil(universalName) && universalName.toLowerCase().includes(filter))
        );
    }

    protected selectionMatch(selectedRow: WidgetDTO, value: WidgetDTO): boolean {
        return selectedRow.id === value.id;
    }
}
