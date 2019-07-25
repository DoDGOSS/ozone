import { IntentInstance } from "../../models/Intent";
import { WidgetInstanceId } from "../../models/types";
import { dashboardStore, DashboardStore } from "../../stores/DashboardStore";
import { intentStore, IntentStore } from "../../stores/IntentStore";

import { EventingService, eventingService } from "./EventingService";
import { RpcMessage } from "./RpcMessage";
import { IntentReceiverMap, IntentRememberedMap } from "./internal";

export class IntentsService {
    private readonly eventingService: EventingService;
    private readonly dashboardStore: DashboardStore;
    private readonly intentStore: IntentStore;

    private readonly remembered = new IntentRememberedMap();
    private readonly receivers = new IntentReceiverMap();

    constructor(_eventingService?: EventingService, _dashboardStore?: DashboardStore, _intentStore?: IntentStore) {
        this.eventingService = _eventingService || eventingService;
        this.dashboardStore = _dashboardStore || dashboardStore;
        this.intentStore = _intentStore || intentStore;
    }

    init() {
        this.eventingService.register("_intents").subscribe(this.onStartIntent.bind(this));
        this.eventingService.register("_intents_receive").subscribe(this.onRegisterReceive.bind(this));
    }

    onStartIntent(message: RpcMessage): void {
        const { sender, senderId, intent, data, targetIds } = parseStartArgs(message);

        const _receiverIds = [...targetIds];

        const rememberedIds = this.remembered.get(senderId, intent);
        if (rememberedIds.length > 0) {
            _receiverIds.push(...rememberedIds);
        }

        if (_receiverIds.length > 0) {
            this.dispatchIntent(message, _receiverIds, sender, intent, data);
            return;
        }

        const onSelected = (selectedIds: WidgetInstanceId[], remember: boolean) => {
            if (remember) {
                this.remembered.set(senderId, intent, selectedIds);
            }
            this.dispatchIntent(message, selectedIds, sender, intent, data);
        };

        const onClosed = () => {
            this.eventingService.callback(message, []);
        };

        this.intentStore.showDialog({
            intent,
            onSelected,
            onClosed
        });
    }

    dispatchIntent(
        message: RpcMessage,
        receiverIds: WidgetInstanceId[],
        sender: string,
        intent: IntentInstance,
        data: any
    ): void {
        const _receiverIds = receiverIds.filter((receiverId) => this.receivers.canReceive(receiverId, intent));

        _receiverIds.forEach((receiverId) => {
            this.eventingService.call(receiverId, "_intents", [sender, intent, data]);
        });

        this.eventingService.callback(message, _receiverIds);
    }

    onRegisterReceive(message: RpcMessage): void {
        const args = message.arguments;
        const { action, dataType } = args[0];
        const receiverId = JSON.parse(args[1]).id;

        this.receivers.set(receiverId, action, dataType);
    }
}

interface StartIntentArgs {
    sender: string;
    senderId: string;
    intent: IntentInstance;
    data: any;
    targetIds: string[];
}

function parseStartArgs(message: RpcMessage): StartIntentArgs {
    // TODO: Validation
    const intent = message.arguments[1];
    const data = message.arguments[2];
    const targetIds = message.arguments[3];

    return {
        sender: message.sender,
        senderId: message.senderId,
        intent,
        data,
        targetIds
    };
}
