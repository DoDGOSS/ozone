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

    async importStore(storeUrl: string, callbackOnCompletion: (store: Widget) => any): Promise<Widget | undefined> {
        let store: Widget | undefined;

        store = await this.tryConnectingAsOmpStore(storeUrl, callbackOnCompletion);

        if (!store) {
            store = await this.tryConnectingAsAmlStore(storeUrl, callbackOnCompletion);
        }

        if (!store) {
            console.log("Error. Store Url not valid.");
        }
        return store;
    }

    private async tryConnectingAsAmlStore(
        storeUrl: string,
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        const gateway = new OzoneGateway(storeUrl);
        let maybeAMLstoreData: any | undefined;
        try {
            maybeAMLstoreData = await gateway.get(`api/metadata`);
        } catch (e) {
            console.log(e);
        }
        if (maybeAMLstoreData) {
            // console.log(maybeAMLstoreData);
            // buildAmlStore
            const store = await this.buildAmlStore(storeUrl, maybeAMLstoreData, callbackOnCompletion);

            if (store) {
                callbackOnCompletion(store);
            }
            return store;
        }
        return undefined;
    }

    private async buildAmlStore(
        storeUrl: string,
        maybeAMLstoreData: { data: string },
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        console.log(maybeAMLstoreData);

        // return this.createAmlStoreWidget(maybeAMLstoreData);
        return undefined;
    }

    private async createAmlStoreWidget(amlStoreData: any): Promise<Widget> {
        return new Widget({
            id: "",
            descriptorUrl: amlStoreData.widgetUrl + "/api/metadata",
            universalName: "store:aml:" + amlStoreData.widgetUrl + "_" + uuid(),
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
            url: amlStoreData.widgetUrl,
            types: [await widgetTypeApi.getWidgetType("marketplace")],
            width: 400, // remember, this is ignored
            height: 400 //   ||
        });
    }

    private async tryConnectingAsOmpStore(
        storeUrl: string,
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        const gateway = new OzoneGateway(storeUrl);
        let maybeOMPstoreData: { data: string } | undefined;
        try {
            maybeOMPstoreData = await gateway.get(`/public/storeDescriptor/`);
        } catch (e) {
            // console.log(e);
        }
        if (maybeOMPstoreData) {
            const store = await this.buildOmpStore(storeUrl, maybeOMPstoreData, callbackOnCompletion);
            if (store) {
                callbackOnCompletion(store);
            }
            return store;
        }
        return undefined;
    }

    private async buildOmpStore(
        storeUrl: string,
        maybeOMPstoreData: { data: string },
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        const htmlJunk: string = maybeOMPstoreData.data;
        if (!htmlJunk.includes("var json = '")) {
            // if you got redirected to the intro/warning screen
            if (
                htmlJunk.includes("Error setting session data") &&
                htmlJunk.includes("marketplaceBody") &&
                htmlJunk.includes("Warning")
            ) {
                this.showNewSessionOMP(storeUrl, callbackOnCompletion);
            } else if (htmlJunk.includes("login-form")) {
                this.showNotLoggedInOMP(storeUrl, callbackOnCompletion);
            }
            console.log("Could not import store.");
            return undefined;
        }
        // get the json part of the hacky-html-wrapped-json-bundle.
        const jsonString = htmlJunk.split("var json = '")[1].split("'\n")[0];
        const storeJsonReponse = JSON.parse(jsonString);
        if (storeJsonReponse.status === 200) {
            return this.createOMPStoreWidget(storeJsonReponse.data);
        }
        return undefined;
    }

    private async createOMPStoreWidget(ompStoreData: any): Promise<Widget> {
        return new Widget({
            id: "",
            descriptorUrl: ompStoreData.widgetUrl + "/public/storeDescriptor",
            height: ompStoreData.height,
            universalName: "store:omp:" + ompStoreData.widgetUrl + "_" + uuid(),
            images: {
                smallUrl: ompStoreData.imageUrlSmall,
                largeUrl: ompStoreData.imageUrlMedium
            },
            intents: {
                send: [],
                receive: []
            },
            isBackground: ompStoreData.background,
            isDefinitionVisible: true, // is this what we want?
            isMaximized: false,
            isMinimized: false,
            x: 0,
            y: 0,
            isMobileReady: ompStoreData.mobileReady,
            isSingleton: ompStoreData.singleton,
            isVisible: ompStoreData.visible,
            title: "",
            url: ompStoreData.widgetUrl,
            types: [await widgetTypeApi.getWidgetType("marketplace")],
            width: ompStoreData.width
        });
    }

    private showNewSessionOMP(storeUrl: string, callbackOnCompletion: (store: Widget) => any) {
        showConfirmationDialog({
            title: "OMP store session refreshed",
            message: [
                "Store access blocked by warning screen.",
                "\n",
                "Navigate to the store directly (",
                { text: storeUrl, style: "link" },
                "), click past the warning screen, and then come back and click OK."
            ],
            onConfirm: () => {
                // retry
                this.tryConnectingAsOmpStore(storeUrl, callbackOnCompletion);
            },
            okButtonMessage: "Ok",
            extraButton: true,
            onExtraButtonSelect: () => window.open(storeUrl),
            extraButtonMessage: "Open store in new tab"
        });
    }

    private showNotLoggedInOMP(storeUrl: string, callbackOnCompletion: (store: Widget) => any) {
        showConfirmationDialog({
            title: "Not logged into OMP store",
            message: [
                "You are not logged into the given OMP store.",
                "\n",
                "Navigate to the store directly (",
                { text: storeUrl, style: "link" },
                "), log in, click past the warning screen, and then come back and click OK"
            ],
            onConfirm: () => {
                // retry
                this.tryConnectingAsOmpStore(storeUrl, callbackOnCompletion);
            },
            okButtonMessage: "Ok; I have logged in",
            extraButton: true,
            onExtraButtonSelect: () => window.open(storeUrl),
            extraButtonMessage: "Open store in new tab"
        });
    }
}

export const storeMetaAPI = new StoreMetaAPI();
