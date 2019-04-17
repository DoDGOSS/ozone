// @ts-ignore
window.Ozone = window.Ozone || {};

// @ts-ignore
var Ozone = window.Ozone;

// @ts-ignore
namespace Ozone.internal.rpc {

    interface RpcMessage {
        s: string;
        f: string;
        c: number;
        a: any[];
        t: any;
        callback: Function;
    }

    const DEFAULT_NAME = "";
    const CALLBACK_NAME = "__cb";

    const VOID_CALLBACK = () => undefined;

    const callbacks: { [id: number]: Function } = {};

    const services: { [id: string]: Function } = {
        [DEFAULT_NAME]: VOID_CALLBACK,
        [CALLBACK_NAME]: dispatchCallback
    };

    let parentTargetOrigin: string = "";

    let callId = 0;

    /**
     * Setup the RPC module and connect the postMessage message listener.
     */
    export function setup() {
        window.addEventListener("message", receive);
    }

    /**
     * Set the targetOrigin used for sending postMessage messages to the container.
     */
    export function setParentTargetOrigin(origin: string): void {
        parentTargetOrigin = origin;
    }

    /**
     * Registers an RPC service.
     *
     * @param serviceName -- Service name to register.
     * @param handler -- Service handler.
     */
    export function register(serviceName: string, handler: Function): void {
        if (serviceName === CALLBACK_NAME) {
            throw new Error("Cannot overwrite callback service");
        }

        if (serviceName === DEFAULT_NAME) {
            throw new Error("Cannot overwrite default service: use registerDefault");
        }

        services[serviceName] = handler;
    }

    /**
     * Unregisters an RPC service.
     *
     * @param serviceName -- Service name to unregister.
     */
    export function unregister(serviceName: string): void {
        if (serviceName === CALLBACK_NAME) {
            throw new Error("Cannot delete callback service");
        }

        if (serviceName === DEFAULT_NAME) {
            throw new Error("Cannot delete default service: use unregisterDefault");
        }

        delete services[serviceName];
    }

    /**
     * Send an RPC message to the container.
     *
     * @param serviceName -- Service name to call.
     * @param callback --  Callback function (if any) to process the return value of the RPC request.
     * @param varargs -- Parameters for the RPC request.
     */
    export function send(serviceName: string, callback: Function | null | undefined, ...varargs: any[]): void {
        const targetWin = window.parent;
        if (!targetWin) {
            throw new Error("failed to send RPC message; window.parent is not defined");
        }

        if (callback) {
            callId++;
            callbacks[callId] = callback;
        }

        const rpcMessage = JSON.stringify({
            s: serviceName,
            f: getId(window.name),
            c: callback ? callId : 0,
            a: varargs,
            t: 0
        });

        targetWin.postMessage(rpcMessage, parentTargetOrigin);
    }

    function receive(message: MessageEvent): void {
        const rpcMessage = parseMessage(message.data);
        if (rpcMessage === undefined) return;

        process(rpcMessage);
    }

    function process(message: RpcMessage): void {
        const service = services[message.s] || services[DEFAULT_NAME];
        if (!service) {
            throw new Error(`failed to process RPC message; no '${message.f}' or default service handler`);
        }

        const result = service.apply(message, message.a);

        if (message.c !== 0 && result !== undefined) {
            message.callback(result);
        }
    }

    function parseMessage(message: string): RpcMessage | undefined {
        const _message = parseJson(message);

        if (!isValidRpcMessage(_message)) return;

        const callback: Function =
            _message.c !== 0
                ? (result: any) => send(CALLBACK_NAME, null, _message.c, result)
                : VOID_CALLBACK;

        return {
            s: _message.s,
            f: _message.f,
            c: _message.c,
            callback: callback,
            a: _message.a,
            t: _message.t
        };
    }

    export function dispatchCallback(callbackId: number, result: any): void {
        const callback = callbacks[callbackId];
        if (!callback) return;

        delete callbacks[callbackId];
        callback(result);
    }

    function parseJson(value: string): any | undefined {
        try {
            return JSON.parse(value);
        } catch (ignored) {
        }
    }

    function isValidRpcMessage(message: unknown): message is RpcMessage {
        if (!isObject(message)) return false;
        if (typeof message.s !== "string") return false;
        if (typeof message.f !== "string") return false;
        if (typeof message.c !== "number") return false;
        if (!Array.isArray(message.a)) return false;
        if (!message.hasOwnProperty("t")) return false;
        return true;
    }

    function isObject(value: unknown): value is { [key: string]: any } {
        return typeof value === "object" && value !== null;
    }

    function getId(windowName: string): string {
        if (windowName.charAt(0) !== "{") return windowName;

        const obj = JSON.parse(windowName);
        return JSON.stringify({ id: obj.id });
    }

}

