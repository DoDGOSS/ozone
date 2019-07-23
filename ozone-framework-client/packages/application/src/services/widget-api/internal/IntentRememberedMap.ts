import { WidgetInstanceId } from "../../../models/types";
import { IntentInstance } from "../../../models/Intent";

interface IntentMapping {
    action: string;
    dataType: string;
    receiverId: string;
}

export class IntentRememberedMap {
    private readonly map: Record<WidgetInstanceId, IntentMapping[]> = {};

    get(senderId: WidgetInstanceId, intent: IntentInstance): WidgetInstanceId[] {
        const mappings = this.map[senderId];
        if (!mappings) return [];

        let idx = 0;
        const receivers = [];
        for (const mapping of mappings) {
            if (intent.action === mapping.action && intent.dataType === mapping.dataType) {
                receivers[idx] = mapping.receiverId;
                idx++;
            }
        }
        return receivers;
    }

    set(senderId: string, intent: IntentInstance, receiverIds: WidgetInstanceId[]) {
        this.map[senderId] = receiverIds.map((receiverId) => ({
            action: intent.action,
            dataType: intent.dataType,
            receiverId
        }));
    }
}
