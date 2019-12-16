import { OzoneGateway } from "../../services/OzoneGateway";

import { Widget } from "../../models/Widget";
import { widgetApi } from "./WidgetAPI";
import { widgetTypeApi } from "./WidgetTypeAPI";
import { widgetFromJson } from "../../codecs/Widget.codec";

import { uuid } from "../../utility";
import { isNil } from "lodash";

export class StoreMetaAPI {
    async getStores(): Promise<Widget[]> {
        return widgetApi.getWidgetsAsUser().then((response) => {
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
        storeBackUrl: string,
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        let store: Widget | undefined;

        if (storeBackUrl && storeFrontUrl) {
            store = await this.tryConnectingAsAmlStore(storeFrontUrl, storeBackUrl, callbackOnCompletion);
        } else {
            console.log("Error. Store Url not valid.");
        }

        // If the store does not have the proper listings for Ozone to interact when the store is added, attempt to add them.
        const missingListings = await this.findMissingListings(storeBackUrl);
        if (store && missingListings && missingListings.length > 0) {
            // We would need to add the missing listing types.
            // console.log("Need to add missing listing types.");
            if (this.addMissingListingsToStore(storeBackUrl, missingListings)) {
                // Positive result means we have added the listing types we needed.
                // console.log("Successfully Added Necessary Listing Types to AML Store.");
            } else {
                // Negative result indicates there was a problem of some kind adding the listing types.
                // console.log("Failed to add necessary listing types to AML store.");
            }
        } else {
            // The store already has all of the listing types needed for Ozone.
            // console.log("Store has all of the correct listing types.");
        }

        return store;
    }

    async storeHasCorrectListings(storeBackUrl: string): Promise<boolean> {
        if ((await this.findMissingListings(storeBackUrl)).length > 0) {
            return false;
        } else {
            return true;
        }
    }

    private async findMissingListings(storeBackUrl: string): Promise<Array<string>> {
        const gateway = new OzoneGateway(storeBackUrl, true);

        // We need the AML store to know about Widget, Dashboard, and Web Application (Stack)
        const neededListingTypes = ["Widget", "Dashboard", "Web Application"];

        let listingData: any | undefined;
        try {
            listingData = await gateway.get(`api/listingtype/`);
        } catch (e) {
            console.log(e);
        }
        const values = JSON.stringify(listingData.data);

        const missingListings: Array<string> = neededListingTypes
            .map((listingItem) => (!values.includes(listingItem) ? listingItem : ""))
            .filter((listingItem) => listingItem !== "");

        return missingListings;
    }

    private async addMissingListingsToStore(storeBackUrl: string, missingListings: string[]): Promise<boolean> {
        let runningResponse: boolean = true;

        const gateway = new OzoneGateway(storeBackUrl, true);

        if (isNil(missingListings)) {
            console.log("WARN: No new listingTypes to add to AML Store."); // Should never be hit.
            return runningResponse;
        } else {
            missingListings.map((listingItem) => {
                const requestData = `{"title":"` + listingItem + `"}`;
                let response: any;
                try {
                    response = gateway.post(`api/listingtype/`, requestData, {
                        headers: { "Content-Type": "application/json" }
                    });
                } catch (e) {
                    console.log(e);
                }
                runningResponse = runningResponse && isNil(response);
            });
        }
        return runningResponse;
    }

    private async tryConnectingAsAmlStore(
        storeFrontUrl: string,
        storeBackUrl: string,
        callbackOnCompletion: (store: Widget) => any
    ): Promise<Widget | undefined> {
        const gateway = new OzoneGateway(storeBackUrl, true);
        let maybeAMLstoreData: any | undefined;
        try {
            maybeAMLstoreData = await gateway.get(`api/metadata/`);
        } catch (e) {
            console.log(e);
        }
        if (maybeAMLstoreData) {
            const store = await this.buildAmlStore(storeFrontUrl, storeBackUrl, maybeAMLstoreData);

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
        maybeAMLstoreData: { data: string }
    ): Promise<Widget | undefined> {
        console.log(storeFrontUrl);
        console.log(storeBackUrl);
        console.log(maybeAMLstoreData);

        const store = await this.createAmlStoreWidget(storeFrontUrl, storeBackUrl);
        console.log(store);

        return store;
    }

    private async createAmlStoreWidget(storeFrontUrl: string, storeBackUrl: string): Promise<Widget> {
        return new Widget({
            id: undefined,
            widgetGuid: "",
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
