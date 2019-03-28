import { WidgetType } from "../models/WidgetType";

export const adminWidgetType: WidgetType = new WidgetType({
    id: 1,
    name: "administration",
    displayName: "administration"
});

export const standardWidgetType: WidgetType = new WidgetType({
    id: 2,
    name: "standard",
    displayName: "standard"
});
