import { createValidator } from "./validate";
import { WIDGET_TYPE_GET_RESPONSE_SCHEMA } from "./schemas/widget.schema";
import { ListOf } from "../interfaces";

export class WidgetTypeDTO {
    id: number;
    name: string;
    displayName: string;
}

export class WidgetTypeReference {
    id: number;
    name: string;
}

export const validateWidgetTypeListResponse = createValidator<ListOf<WidgetTypeDTO[]>>(WIDGET_TYPE_GET_RESPONSE_SCHEMA);
