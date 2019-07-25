import { IntentAction, IntentDataType, WidgetInstanceId } from "../../../models/types";
import { IntentInstance } from "../../../models/Intent";

type DataTypesByAction = Record<IntentAction, IntentDataType[]>;

export class IntentReceiverMap {
    private readonly map: Record<WidgetInstanceId, DataTypesByAction> = {};

    canReceive(id: WidgetInstanceId, intent: IntentInstance): boolean {
        const instanceActions = this.map[id];
        if (!instanceActions) return false;

        const actionDataTypes = instanceActions[intent.action];
        if (!actionDataTypes) return false;

        return actionDataTypes.some((a) => a === intent.dataType);
    }

    set(id: WidgetInstanceId, action: IntentAction, dataType: IntentDataType): void {
        const instanceActions = this.map[id];
        if (!instanceActions) {
            this.map[id] = { [action]: [dataType] };
            return;
        }

        const actionDataTypes = instanceActions[action];
        if (!actionDataTypes) {
            instanceActions[action] = [dataType];
            return;
        }

        if (actionDataTypes.some((d) => d === dataType)) return;

        actionDataTypes.push(dataType);
    }
}
