import { isNil } from "../util";


export async function getOpenedWidgets(): Promise<OWF.Widget[]> {
    return new Promise<OWF.Widget[]>((resolve, reject) => {
        try {
            OWF.getOpenedWidgets((widgets) => {
                if (isNil(widgets)) {
                    reject(new Error("Failed to get opened widgets list"));
                }
                resolve(widgets);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}


export async function findWidgetByUniversalName(universalName: string): Promise<OWF.Widget> {
    const widgets = await getOpenedWidgets();

    const widget = widgets.find((w) => w.universalName === universalName);

    if (isNil(widget)) {
        throw new Error(`Widget not found with universal name: ${universalName}`);
    }

    return widget;
}

