import { Widget } from "../models/Widget";

import { widgetCreateRequestFromWidget, widgetUpdateRequestFromWidget } from "../codecs/Widget.codec";

import { widgetApi } from "../api/clients/WidgetAPI";

import { MarketplaceAPI } from "../api/clients/MarketplaceAPI";
import { AmlMarketplaceAPI } from "../api/clients/AmlMarketplaceAPI";

export interface InfractingItemUrl {
    type: "stack" | "dashboard" | "widget";
    name: string;
    url: string;
}

class StoreMetaService {
    async saveOrUpdateStore(store: Widget): Promise<any> {
        if (store.id === undefined || store.id === "") {
            return widgetApi.createWidget(await widgetCreateRequestFromWidget(store));
        } else {
            return widgetApi.updateWidget(await widgetUpdateRequestFromWidget(store));
        }
    }

    cleanStoreUrl(storeUrl: string): string {
        if (storeUrl[-1] === "/") {
            const cleanedUrl = storeUrl.slice(0, -1);
            return cleanedUrl;
        } else {
            return storeUrl;
        }
    }

    getStoreApi(store: Widget): MarketplaceAPI | undefined {
        if (store.descriptorUrl && store.descriptorUrl !== "") {
            return new AmlMarketplaceAPI(this.cleanStoreUrl(store.descriptorUrl)); // aml has separate front and back. We need the back
        }
        console.log("Tags or URLs missing on store widget; couldn't use as a store.");
        return undefined;
    }
}

export const storeMetaService = new StoreMetaService();
