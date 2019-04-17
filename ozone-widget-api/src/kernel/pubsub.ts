// @ts-ignore
window.Ozone = window.Ozone || {};

// @ts-ignore
var Ozone = window.Ozone;

// @ts-ignore
namespace Ozone.internal.pubsub {

    const PUBSUB_NAME = "pubsub";

    const listeners: { [channel: string]: Function } = {};

    export function publish(channel: string, message: string): void {
        Ozone.internal.rpc.send(PUBSUB_NAME, null, "publish", channel, message);
    }

    export function subscribe(channel: string, callback: Function): void {
        listeners[channel] = callback;
        Ozone.internal.rpc.register(PUBSUB_NAME, dispatch);
        Ozone.internal.rpc.send(PUBSUB_NAME, null, "subscribe", channel);
    }

    export function unsubscribe(channel: string): void {
        delete listeners[channel];
        Ozone.internal.rpc.send(PUBSUB_NAME, null, "unsubscribe", channel);
    }

    function dispatch(channel: string, sender: any, message: any): void {
        const listener = listeners[channel];
        if (typeof listener !== "function") return;

        listener(sender, message, channel);
    }

}

