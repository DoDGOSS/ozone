import { isRegExp, map } from "lodash";

import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { WidgetInstance } from "../../models/WidgetInstance";

import { dashboardStore } from "../../stores/DashboardStore";
import { errorStore } from "../ErrorStore";

import { getIn, isBlank, isNil, isString, isStringArray, Predicate } from "../../utility";
import { expectArgument, RpcMessage } from "./RpcMessage";

// Enable to log received messages to the developer console
const ENABLE_DEBUG_MESSAGE_LOGGING = true;
const ENABLE_DEBUG_VERBOSE_MESSAGE_LOGGING = true;

interface Widget2 {
    id: string;
    frameId: string;
    name: string;
    universalName: string;
    url: string;
    widgetGuid: string;
    widgetName: string;
}

interface WidgetClient {
    instanceId: string;
    info: Widget2;
    functions?: string[];
    origin: string;
    ready: boolean;
}

/**
 * TODO: Handlers for subscriptions to event channels: _dragStart, _dragOutName, _dragStopInContainer, and _dropReceiveData.
 *
 * TODO: Handlers for _WIDGET_STATE_CHANNEL_{$widgetGuid} messages: activateWidget
 */

function messageServiceMatches(service: string | RegExp): Predicate<RpcMessage> {
    if (isRegExp(service)) {
        return (message: RpcMessage) => service.test(message.service);
    }

    return (message: RpcMessage) => message.service === service;
}

export class EventingService {
    private readonly events$ = new Subject<RpcMessage>();

    private widgets: { [id: string]: WidgetClient } = {};

    private subscriptions: { [channel: string]: WidgetClient[] } = {};

    init() {
        if (isNil(window.name) || (isString(window.name) && isBlank(window.name))) {
            window.name = "ContainerWindowName" + Math.random();
        }

        window.addEventListener("message", this.receiveMessage.bind(this), false);

        this.register("container_init").subscribe(this.onWidgetInit.bind(this));
        this.register("_widgetReady").subscribe(this.onWidgetReady.bind(this));
        this.register("_getWidgetReady").subscribe(this.onGetWidgetReady.bind(this));
        this.register("register_functions").subscribe(this.onRegisterFunctions.bind(this));
        this.register("FUNCTION_CALL").subscribe(this.onFunctionCall.bind(this));
        this.register("FUNCTION_CALL_RESULT").subscribe(this.onFunctionCallResult.bind(this));
        this.register("LIST_WIDGETS").subscribe(this.onListWidgets.bind(this));
        this.register("GET_FUNCTIONS").subscribe(this.onGetFunctions.bind(this));
        this.register("pubsub").subscribe(this.onPubSub.bind(this));
        this.register(/^_WIDGET_STATE_CHANNEL/).subscribe(this.onWidgetStateMessage.bind(this));
    }

    register(service: string | RegExp): Observable<RpcMessage> {
        return this.events$.pipe(filter(messageServiceMatches(service)));
    }

    callback(message: RpcMessage, response: any): void {
        this.call(message.senderId, "__cb", [message.callback, response]);
    }

    call(widget: WidgetClient | string, service: string, args: any): void {
        const target = typeof widget === "string" ? this.requireWidget(widget) : widget;

        const message = formatRpcMessage(service, "..", args);

        const iframeWindow = findWidgetIFrameWindow(target.instanceId);

        iframeWindow.postMessage(message, target.origin);
    }

    private requireWidget(id: string): WidgetClient {
        const widget = this.widgets[id];
        if (isNil(widget)) {
            throw new Error(`widget with id '$id' not registered`);
        }
        return widget;
    }

    private respond(message: RpcMessage, service: string, args: any): void {
        this.call(message.senderId, service, args);
    }

    private receiveMessage(message: any): void {
        if (!isRpcMessage(message)) return;

        try {
            const rpcMessage = parseRpcMessage(message);

            if (ENABLE_DEBUG_VERBOSE_MESSAGE_LOGGING) {
                const widget = this.widgets[rpcMessage.senderId];
                const source = (widget && widget.info.name) || rpcMessage.senderId;
                console.groupCollapsed(`EventingService ← ${source}`);
                console.dir(message);
                console.groupEnd();
            }

            this.events$.next(rpcMessage);
        } catch (error) {
            errorStore.warning("EventingService", `failed to parse RPC message: ${error.message}`);
        }
    }

    private isWidgetReady(id: string): boolean {
        const widget = this.widgets[id];

        return (widget && widget.ready) || false;
    }

    private onWidgetInit(message: RpcMessage): void {
        try {
            const instance = findWidgetInDashboard(message.senderId);
            const instanceId = instance.id;

            const userWidget = instance.userWidget;
            const widget = userWidget.widget;

            this.widgets[instanceId] = {
                instanceId,
                info: {
                    id: instanceId,
                    name: userWidget.title,
                    url: widget.url,
                    frameId: `widget-${instanceId}`,
                    widgetGuid: widget.id ? widget.id.toString() : "",
                    widgetName: userWidget.title,
                    universalName: widget.universalName || ""
                },
                ready: false,
                origin: message.raw.origin
            };

            this.call(instanceId, "after_container_init", [window.name, `{"id":"${window.name}"}`]);
        } catch (error) {
            errorStore.warning("EventingService Error", `onWidgetInit error: ${error.message}`);
        }
    }

    private onWidgetReady(message: RpcMessage): void {
        try {
            const widget = this.requireWidget(message.senderId);
            widget.ready = true;
        } catch (error) {
            errorStore.warning("EventingService Error", `onWidgetReady error: ${error.message}`);
        }
    }

    private onGetWidgetReady(message: RpcMessage): void {
        try {
            const targetId = expectArgument(message, 0, isString);

            const response = this.isWidgetReady(targetId);

            this.callback(message, response);
        } catch (error) {
            errorStore.warning("EventingService Error", `onGetWidgetReady error: ${error.message}`);
        }
    }

    private onListWidgets(message: RpcMessage): void {
        try {
            const response = map(this.widgets, (client) => client.info);

            this.callback(message, response);
        } catch (error) {
            errorStore.warning("EventingService Error", `onListWidgets error: ${error.message}`);
        }
    }

    private onRegisterFunctions(message: RpcMessage): void {
        try {
            const functions = expectArgument(message, 1, isStringArray);

            const widget = this.requireWidget(message.senderId);

            widget.functions = functions;
        } catch (error) {
            errorStore.warning("EventingService Error", `onRegisterFunctions error: ${error.message}`);
        }
    }

    private onGetFunctions(message: RpcMessage): void {
        try {
            const targetId = expectArgument(message, 0, isString);

            const widget = this.widgets[targetId];
            const functions = (widget && widget.functions) || [];

            this.respond(message, "__cb", [message.callback, functions]);
        } catch (error) {
            errorStore.warning("EventingService Error", `onGetFunctions error: ${error.message}`);
        }
    }

    private onFunctionCall(message: RpcMessage): void {
        try {
            const targetId = expectArgument(message, 0, isString);
            const functionName = expectArgument(message, 2, isString);
            const functionArgs = expectArgument(message, 3);

            this.call(targetId, "FUNCTION_CALL_CLIENT", [targetId, message.senderId, functionName, functionArgs]);
        } catch (error) {
            errorStore.warning("EventingService Error", `onFunctionCall error: ${error.message}`);
        }
    }

    private onFunctionCallResult(message: RpcMessage): void {
        try {
            const remoteId = message.senderId;
            const callerId = expectArgument(message, 1, isString);
            const functionName = expectArgument(message, 2, isString);
            const functionResult = expectArgument(message, 3);

            this.call(callerId, "FUNCTION_CALL_RESULT_CLIENT", [remoteId, functionName, functionResult]);
        } catch (error) {
            errorStore.warning("EventingService Error", `onFunctionCallResult error: ${error.message}`);
        }
    }

    private onPubSub(message: RpcMessage): void {
        try {
            const widget = this.requireWidget(message.senderId);

            const action = expectArgument(message, 0, isString);

            if (ENABLE_DEBUG_MESSAGE_LOGGING) {
                console.groupCollapsed(`PubSub: ${widget.info.name} → ${action}`);
                console.dir(message);
                console.groupEnd();
            }

            if (action === "subscribe") {
                const channel = expectArgument(message, 1, isString);
                this.addSubscription(widget, channel);
            } else if (action === "publish") {
                const channel = expectArgument(message, 1, isString);
                const data = expectArgument(message, 2);

                this.broadcastMessage(widget, channel, data);
            }
        } catch (error) {
            errorStore.warning("EventingService Error", `onPubSub error: ${error.message}`);
        }
    }

    private onWidgetStateMessage(message: RpcMessage) {
        try {
            const widget = this.requireWidget(message.senderId);

            if (ENABLE_DEBUG_MESSAGE_LOGGING) {
                console.groupCollapsed(`Widget State Channel: ${widget.info.name} →`);
                console.dir(message);
                console.groupEnd();
            }
        } catch (error) {
            errorStore.warning("EventingService Error", `onWidgetStateMessage error: ${error.message}`);
        }
    }

    private addSubscription(client: WidgetClient, channel: string): void {
        if (!this.isSubscribed(client, channel)) {
            if (ENABLE_DEBUG_MESSAGE_LOGGING) {
                console.log(`PubSub: ${client.info.name} subscribed to '${channel}' channel`);
            }
            this.subscriptions[channel] = (this.subscriptions[channel] || []).concat(client);
        }
    }

    private isSubscribed(client: WidgetClient, channel: string): boolean {
        const subscriptions = this.subscriptions[channel] || [];
        for (const subscriber of subscriptions) {
            if (subscriber.instanceId === client.instanceId) return true;
        }
        return false;
    }

    private broadcastMessage(client: WidgetClient, channel: string, message: any): void {
        const senderId = client.instanceId;

        const subscriptions = this.subscriptions[channel] || [];
        for (const subscriber of subscriptions) {
            this.call(subscriber, "pubsub", [channel, senderId, message]);
        }
    }
}

export function parseJson(value: string): any | undefined {
    try {
        return JSON.parse(value);
    } catch (error) {
        return undefined;
    }
}

function formatRpcMessage(service: string, from: string, args: any, callback?: any, token?: any): string {
    return JSON.stringify({
        s: service,
        f: from,
        a: args,
        c: callback || 0,
        t: token || 0
    });
}

export const eventingService = new EventingService();

function isRpcMessage(message: any): boolean {
    if (isNil(message)) return false;
    if (isNil(message.data)) return false;
    if (!isString(message.data)) return false;
    return message.data.startsWith("{");
}

function parseRpcMessage(message: any): RpcMessage {
    const data = JSON.parse(message.data);

    if (typeof data.f !== "string") {
        throw new Error("'message.data.sender' must be a string");
    }

    const senderId = getIn(parseJson(data.f), "id", isString);
    if (isNil(senderId)) {
        throw new Error("'message.data.f' must be an object with a string 'id' property");
    }

    return {
        service: data.s,
        sender: data.f,
        senderId,
        callback: data.c,
        arguments: data.a,
        token: data.t,
        origin: message.origin,
        raw: message
    };
}

function findWidgetIFrameWindow(id: string): Window {
    const iframe = document.getElementById(`widget-${id}`) as HTMLIFrameElement;
    if (isNil(iframe)) {
        throw new Error(`no iframe found with id 'widget-${id}'`);
    }

    const contentWindow = iframe.contentWindow;
    if (isNil(contentWindow)) {
        throw new Error("`iframe for id 'widget-${id}' has no contentWindow`");
    }

    return contentWindow;
}

function findWidgetInDashboard(instanceId: string): WidgetInstance {
    const dashboard = dashboardStore.currentDashboard().value;
    if (isNil(dashboard)) {
        throw new Error("no current Dashboard exists");
    }

    const widget = dashboard.findWidget(instanceId);
    if (isNil(widget)) {
        throw new Error(`Widget instance [id: ${instanceId}] not in current Dashboard`);
    }

    return widget;
}
