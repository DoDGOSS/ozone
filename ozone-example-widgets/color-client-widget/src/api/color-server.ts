import { findWidgetByUniversalName } from "./index";
import { getWidgetProxy } from "./rpc";


const COLOR_SERVER_UNIVERSAL_NAME = "org.owfgoss.owf.examples.ColorServer";


export interface ColorServer {
    getColors(callback: (result: ColorResult) => void): void;
    setColor(color: string, callback?: (result: any) => void): void;
}


export interface ColorResult {
    colors: string[];
    selected: string;
}


export async function getColorServerProxy(): Promise<ColorServer> {
    const colorServer = await findWidgetByUniversalName(COLOR_SERVER_UNIVERSAL_NAME);
    return getWidgetProxy<ColorServer>(colorServer.id);
}
