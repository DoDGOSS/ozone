import { Widget, WidgetDefinition } from "../../../stores/interfaces";

export class ObservableWidget implements Widget {
    static fromWidget(widget: Widget): ObservableWidget {
        return new ObservableWidget(widget.id, widget.definition);
    }

    readonly id: string;

    readonly definition: WidgetDefinition;

    constructor(id: string, definition: WidgetDefinition) {
        this.id = id;
        this.definition = definition;
    }
}
