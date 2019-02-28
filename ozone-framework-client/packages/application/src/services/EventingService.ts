import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { Widget } from "../stores/interfaces";
import { dashboardStore } from "../stores/DashboardStore";
import { errorStore } from "./ErrorStore";

import { map } from "lodash";
import { getIn, isBlank, isNil, isString, isStringArray, TypeGuard } from "../utility";

// Enable to log received messages to the developer console
const DEBUG = false;

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
    id: string;
    iframeWindow: Window;
    info: Widget2;
    functions?: string[];
    origin: string;
    ready: boolean;
}


export class EventingService {

    private readonly events$ = new Subject<RpcMessage>();

    private widgets: { [id: string]: WidgetClient } = {};

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
    }

    register(service: string): Observable<RpcMessage> {
        return this.events$.pipe(filter((message) => message.service === service));
    }

    private requireWidget(id: string): WidgetClient {
        const widget = this.widgets[id];
        if (isNil(widget)) {
            throw new Error(`widget with id '$id' not registered`);
        }
        return widget;
    }

    private call(widgetId: string, service: string, args: any): void {
        const widget = this.requireWidget(widgetId);

        const target = widget.iframeWindow;

        target.postMessage(formatRpcMessage(service, "..", args), widget.origin);
    }

    private respond(message: RpcMessage, service: string, args: any): void {
        this.call(message.senderId, service, args);
    }

    private callback(message: RpcMessage, response: any): void {
        this.call(message.senderId, "__cb", [message.callback, response]);
    }

    private receiveMessage(message: any): void {
        if (!isRpcMessage(message)) return;

        if (DEBUG) {
            console.log("EventingService receiveMessage");
            console.dir(message);
        }

        try {
            const rpcMessage = parseRpcMessage(message);

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
            const widget = findWidgetInDashboard(message.senderId);
            const iframeWindow = findWidgetIFrameWindow(widget.id);

            this.widgets[widget.id] = {
                id: widget.id,
                info: {
                    id: widget.id,
                    name: widget.definition.title,
                    url: widget.definition.url!,
                    frameId: `widget-${widget.id}`,
                    widgetGuid: widget.definition.id,
                    widgetName: widget.definition.title,
                    universalName: widget.definition.universalName
                },
                ready: false,
                origin: message.raw.origin,
                iframeWindow
            };

            this.call(widget.id, "after_container_init", [window.name, `{"id":"${window.name}"}`]);
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

}

function expectArgument<T>(message: RpcMessage, index: number, guard?: TypeGuard<T>): T {
    const value = message && message.arguments && message.arguments[index];

    if (guard && !guard(value)) {
        throw new Error(`expected message argument ${index} to be type '${guard.toString()}'`);
    }

    return value;
}

function parseJson(value: string): any | null {
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
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

interface RpcMessage {
    service: string;
    sender: string;
    senderId: string;
    arguments: any[];
    callback: any;
    token: any;
    origin: string;
    raw: any;
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

function findWidgetInDashboard(widgetId: string): Widget {
    const dashboard = dashboardStore.currentDashboard();
    if (isNil(dashboard)) {
        throw new Error("no current Dashboard exists");
    }

    const widget = dashboard.widgets[widgetId];
    if (isNil(widget)) {
        throw new Error(`Widget [id: ${widgetId}] not in current Dashboard`);
    }

    if (isNil(widget.definition.url)) {
        throw new Error(`Widget [id: ${widgetId}] has no URL property`);
    }

    return widget;
}
