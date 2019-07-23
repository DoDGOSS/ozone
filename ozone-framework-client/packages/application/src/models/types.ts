import { Dashboard } from "./Dashboard";
import { IntentInstance } from "./Intent";
import { Panel } from "./panel";
import { UserWidget } from "./UserWidget";
import { Widget } from "./Widget";
import { WidgetInstance } from "./WidgetInstance";

export type DashboardGuid = PropertyOf<Dashboard, "guid">;

export type IntentAction = PropertyOf<IntentInstance, "action">;

export type IntentDataType = PropertyOf<IntentInstance, "dataType">;

export type PanelId = PropertyOf<Panel, "id">;

export type UserWidgetId = PropertyOf<UserWidget, "id">;

export type WidgetId = PropertyOf<Widget, "id">;

export type WidgetInstanceId = PropertyOf<WidgetInstance, "id">;
