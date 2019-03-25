import { createValidator } from "./validate";
import { WIDGET_TYPE_SCHEMA } from "./schemas/widget.schema";

export class WidgetTypeDTO {
    id: number;
    name: string;
    displayName: string;
}

export const validateWidgetType = createValidator<WidgetTypeDTO>(WIDGET_TYPE_SCHEMA);

export class WidgetTypeReference {
    id: number;
    name: string;
}
