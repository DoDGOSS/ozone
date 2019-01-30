import { isNil } from "../../util";


export async function getWidgetProxy<T>(widgetId: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        try {
            OWF.RPC.getWidgetProxy(widgetId, (proxy) => {
                if (isNil(proxy)) {
                    reject(new Error(`Failed to get RPC proxy for widget with id: ${widgetId}`));
                }
                resolve(proxy);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}
