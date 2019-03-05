export const ENABLE_DEBUG_MESSAGE_LOGGING = false;

export function enableMessageLogging(title: string) {
    window.addEventListener(
        "message",
        (message: any) => {
            if (typeof message.data === "string") {
                console.groupCollapsed(title);
                console.dir(message);
                console.groupEnd();
            }
        },
        false
    );
}
