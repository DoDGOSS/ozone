import { WidgetTypeDTO } from "../api/models/WidgetTypeDTO";

import { WidgetType } from "../models/WidgetType";

export function widgetTypeFromJson(dto: WidgetTypeDTO) {
    return new WidgetType({
        id: dto.id,
        name: dto.name,
        displayName: dto.displayName
    });
}
