import * as qs from "qs";

import { OzoneGateway } from "../../services/OzoneGateway";

import { Widget } from "../../models/Widget";
import { widgetApi } from "./WidgetAPI";
import { widgetTypeApi } from "./WidgetTypeAPI";
import { widgetFromJson } from "../../codecs/Widget.codec";

import { showConfirmationDialog } from "../../components/confirmation-dialog/showConfirmationDialog";

import { errorStore } from "../../services/ErrorStore";
import { uuid } from "../../utility";

export class StoreMetaAPI {
    async getStores(): Promise<Widget[]> {
        return widgetApi.getWidgets().then((response) => {
            const storeWidgets = [];
            for (const widgetDto of response.data.data) {
                if (widgetDto.value.widgetTypes.find((type) => type.name === "marketplace")) {
                    storeWidgets.push(widgetFromJson(widgetDto));
                }
            }
            return storeWidgets;
        });
    }

    async importStore(
        storeFrontUrl: string,
        storeBackUrl: string | undefined,
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        let store: Widget | undefined;

        if (storeBackUrl && storeFrontUrl) {
            store = await this.tryConnectingAsAmlStore(storeFrontUrl, storeBackUrl, callbackOnCompletion);
        } else {
            console.log("Error. Store Url not valid.");
        }
        return store;
    }

    private async tryConnectingAsAmlStore(
        storeFrontUrl: string,
        storeBackUrl: string,
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        const gateway = new OzoneGateway(storeBackUrl);
        let maybeAMLstoreData: any | undefined;
        try {
            maybeAMLstoreData = await gateway.get(`api/metadata`);
        } catch (e) {
            console.log(e);
        }
        if (maybeAMLstoreData) {
            const store = await this.buildAmlStore(
                storeFrontUrl,
                storeBackUrl,
                maybeAMLstoreData,
                callbackOnCompletion
            );

            if (store) {
                callbackOnCompletion(store);
            }
            return store;
        }
        return undefined;
    }

    private async buildAmlStore(
        storeFrontUrl: string,
        storeBackUrl: string,
        maybeAMLstoreData: { data: string },
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        console.log(storeFrontUrl);
        console.log(storeBackUrl);
        console.log(maybeAMLstoreData);

        const store = await this.createAmlStoreWidget(storeFrontUrl, storeBackUrl, maybeAMLstoreData);
        console.log(store);

        return store;
    }

    private async createAmlStoreWidget(
        storeFrontUrl: string,
        storeBackUrl: string,
        amlStoreData: any
    ): Promise<Widget> {
        return new Widget({
            id: "",
            descriptorUrl: storeBackUrl,
            universalName: "store:aml:" + storeFrontUrl + "_" + uuid(),
            images: {
                smallUrl: "", // probably make this some default icon
                largeUrl: ""
            },
            intents: {
                send: [],
                receive: []
            },
            isBackground: false,
            isDefinitionVisible: true,
            isMaximized: false,
            isMinimized: false,
            x: 0,
            y: 0,
            isMobileReady: false,
            isSingleton: true,
            isVisible: true,
            title: "",
            url: storeFrontUrl,
            types: [await widgetTypeApi.getWidgetType("marketplace")],
            width: 400, // remember, this is ignored
            height: 400 //   ||
        });
    }

}

export const storeMetaAPI = new StoreMetaAPI();
