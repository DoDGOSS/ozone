import { Gateway } from "../interfaces";
import { OzoneGateway } from "../../services/OzoneGateway";

import { MarketplaceAPI } from "./MarketplaceAPI";

import { Widget } from "../../models/Widget";
import { Dashboard } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";

import { StackUpdateRequest } from "../models/StackDTO";

import { AMLListingDTO } from "../models/AMLStoreDTO";
import { AMLListing } from "../../models/AMLListing";
import { isNil } from "lodash";

export class AmlMarketplaceAPI implements MarketplaceAPI {
    private readonly gateway: Gateway;

    constructor(storeUrl: string) {
        this.gateway = new OzoneGateway(storeUrl); // may have to create a new gateway? Not sure how authentication is going to work out
    }

    storeListingAsDashboard(stackID: number, dashListing: any): Promise<Dashboard | undefined> {
        return new Promise(() => undefined);
    }

    storeListingAsStack(stackID: number, stackListing: AMLListingDTO): Promise<Stack | undefined> {
        return new Promise(() => undefined);
    }

    listingAsSimpleNewStack(listing: AMLListingDTO): StackUpdateRequest | undefined {
        return undefined;
    }

    getAllUniqueWidgetsFromStackListing(listing: AMLListingDTO): Promise<Widget[]> {
        return new Promise(() => []);
    }

    storeListingAsWidget(listing: AMLListingDTO): Promise<Widget | undefined> {
        return new Promise(() => undefined);
    }

    getListingType(listing: AMLListingDTO): "widget" | "dash" | "stack" | undefined {
        return undefined;
    }

    async uploadStack(stack: Stack): Promise<{ success: boolean; message: string }> {
        const widgetToTest: Widget = stack.getWidgets()[0];
        console.log("TESTING WIDGET: " + widgetToTest.title);
        return this.uploadWidget(widgetToTest); // just test pushing up the first widget in a stack for now.
        // return { success: false, message: "Not implemented" };
    }

    async uploadWidget(widget: Widget): Promise<{ success: boolean; message: string }> {
        const amlListingToUpload: AMLListing | undefined = this.getListingFromWidget(widget);
        if (amlListingToUpload) {
            const existingListing: any | undefined | null = await this.findListingInStore(amlListingToUpload);

            if (existingListing === null) {
                return this.uploadNewListing(amlListingToUpload);
            } else if (existingListing === undefined) {
                return { success: false, message: "ERROR in listing response from the AML Store" };
            } else {
                return this.updateExistingListing(existingListing, amlListingToUpload);
            }
        } else {
            return { success: false, message: "Could not convert Widget to AML Listing Successfully!" };
        }
    }

    private async findListingInStore(listing: AMLListing): Promise<any | undefined | null> {
        let response: any;
        try {
            response = await this.gateway.get(`api/listing/`);
        } catch (e) {
            console.log(e);
        }

        const foundListings: any = response.data.filter(
            (lItem: AMLListing) => lItem.unique_name === listing.unique_name
        );

        if (response.status !== 200 || foundListings.length > 1) {
            return undefined;
        } else if (foundListings.length === 1) {
            return foundListings[0];
        } else {
            return null;
        }
    }

    private async uploadNewListing(listing: AMLListing): Promise<{ success: boolean; message: string }> {
        const requestData = JSON.stringify(listing);
        console.log("ATTEMPTING TO UPLOAD WIDGET AS A NEW LISTING TO AML STORE: " + requestData);
        let response: any;
        try {
            response = await this.gateway.post(`api/listing/`, requestData, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            console.log(e);
        }

        console.log("ENTIRE RESPONSE: " + JSON.stringify(response));

        let responseMessage: string = response.statusText;
        const responseSuccess: boolean = response.status === 200;
        if (responseSuccess) {
            responseMessage = "Widget " + listing.title + " Created successfully!";
        } else {
            responseMessage = response.message;
        }

        return { success: responseSuccess, message: responseMessage };
    }

    private async updateExistingListing(
        existingListing: any,
        newListing: AMLListing
    ): Promise<{ success: boolean; message: string }> {
        const cleanedUpListing = this.cleanUpListingToUpload(newListing, existingListing);
        const requestData = JSON.stringify(cleanedUpListing);

        let response: any;
        try {
            response = await this.gateway.put(`api/listing/` + existingListing.id + `/`, requestData, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            console.log(e);
        }

        let responseMessage: string = response.statusText;
        const responseSuccess: boolean = response.status === 200;
        if (responseSuccess) {
            responseMessage = "Widget " + cleanedUpListing.title + " Updated successfully!";
        } else {
            responseMessage = response.message;
        }

        return { success: responseSuccess, message: responseMessage };
    }

    private cleanUpListingToUpload(newListing: AMLListing, existingListing: any): any {
        // Take the object as it was given to us from the AML store, and update the values we could possibly have changed
        const updatedListing: any = existingListing;
        updatedListing.title = newListing.title;
        updatedListing.description = newListing.description;
        updatedListing.launch_url = newListing.launch_url;
        updatedListing.version_name = newListing.version_name;
        return updatedListing;
    }

    private getListingFromWidget(widget: Widget): AMLListing | undefined {
        const listing: AMLListing = new AMLListing({
            id: undefined,
            small_icon: this.getOrCreateAMLIcon(),
            large_icon: this.getOrCreateAMLIcon(),
            banner_icon: undefined,
            large_banner_icon: undefined,
            listing_type: {
                title: "Widget"
            },
            title: widget.title,
            description: isNil(widget.description) ? "" : widget.description,
            launch_url: widget.url,
            version_name: isNil(widget.version) ? "" : widget.version,
            unique_name: widget.universalName,
            description_short: undefined,
            is_enabled: true,
            is_deleted: false,
            security_marking: "UNCLASSIFIED",
            is_private: undefined,
            required_listings: undefined
        });

        if (listing) {
            return listing;
        } else {
            return undefined;
        }
    }

    private getOrCreateAMLIcon(): any | undefined {
        return { id: 1 };
        // TODO: Sort out the pushing and using of icons in an AML Store
        // console.log("ATTEMPTING TO FIND OR CREATE AN AML ICON FOR: " + iconUrl);
        // const amlIconToCreate: AMLIcon = new AMLIcon({url:iconUrl,security_marking: "UNCLASSIFIED"})
        // const dataToPost = JSON.stringify(amlIconToCreate);
        // console.log("POSTIMG: " + dataToPost);
        // let response: any;
        // try {
        //     response = this.gateway.get(`api/image/`);
        // } catch (e) {
        //     console.log(e);
        // }
        // console.log(JSON.stringify(response));
        // return undefined;
    }
}
