declare namespace OWF {
    export function _init(window: Window, document: Document): void;

    export function ready(callback: () => void): void;

    export function notifyWidgetReady(): void;

    export function getOpenedWidgets(callback: (widgets: Widget[]) => void): void;

    export interface Widget {
        frameId: string;
        id: string;
        name: string;
        universalName: string;
        url: string;
        widgetGuid: string;
        widgetName: string;
    }

    namespace Eventing {
        type MessageCallback = (sender: any, message: string, channel: string) => void;

        export function publish(channel: string, message: string): void;

        export function subscribe(channel: string, callback: MessageCallback): void;

        export function unsubscribe(channel: string): void;
    }

    namespace Preferences {
        interface UserPreference {
            id: number;
            namespace: string;
            path: string;
            user: {
                userId: string;
            };
            value: string;
        }

        interface UserPreferenceNotFound {
            preference: null;
            success: true;
        }

        type GetUserPreferenceOptions = {
            namespace: string;
            name: string;
            onSuccess: (preference: UserPreference | UserPreferenceNotFound) => void;
            onFailure: (error: any) => void;
        };

        export function getUserPreference(options: GetUserPreferenceOptions): void;

        type SetUserPreferenceOptions = {
            namespace: string;
            name: string;
            value: string;
            onSuccess: (preference: UserPreference) => void;
            onFailure: (error: any) => void;
        };

        export function setUserPreference(options: SetUserPreferenceOptions): void;

        type DeleteUserPreferenceOptions = {
            namespace: string;
            name: string;
            onSuccess: (result: any) => void;
            onFailure: (error: any) => void;
        };

        export function deleteUserPreference(options: DeleteUserPreferenceOptions): void;
    }

    namespace RPC {
        type RegisterFunction = {
            name: string;
            fn: Function;
        };

        export function registerFunctions(functions: RegisterFunction[]): void;

        export function getWidgetProxy(widgetId: string, callback: (proxy: any) => void): void;
    }
}

declare namespace Ozone {
    export interface WidgetDTO {
        id: string;
        value: {
            id: string;
            namespace: string;
        };
    }

    export namespace pref {
        export interface FindWidgetOptions {
            searchParams: any;
            onSuccess: (results: WidgetDTO[]) => void;
            onFailure: (error: any) => void;
        }

        export interface PrefServer {
            findWidgets(options: FindWidgetOptions): void;
        }

        export const PrefServer: PrefServer;
    }

    export namespace util {
        export function isInContainer(): boolean;
    }

    export namespace eventing {
        export namespace Widget {
            export let widgetRelayURL: string;
        }
    }
}
