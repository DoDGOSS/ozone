import { TypeGuard } from "../../utility";

export interface RpcMessage {
    service: string;
    sender: string;
    senderId: string;
    arguments: any[];
    callback: any;
    token: any;
    origin: string;
    raw: any;
}

export function expectArgument<T>(message: RpcMessage, index: number, guard?: TypeGuard<T>): T {
    const value = message && message.arguments && message.arguments[index];

    if (guard && !guard(value)) {
        throw new Error(`expected message argument ${index} to be type '${guard.toString()}'`);
    }

    return value;
}
