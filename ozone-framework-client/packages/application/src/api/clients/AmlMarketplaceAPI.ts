import * as qs from "qs";

import { Gateway, getGateway, Response } from "../interfaces";
import { OzoneGateway } from "../../services/OzoneGateway";

import { MarketplaceAPI } from "./MarketplaceAPI";
import { widgetApi } from "./WidgetAPI";

import { Widget } from "../../models/Widget";
import { Panel } from "../../models/panel";
import { Dashboard } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";

import { StackUpdateRequest } from "../models/StackDTO";
import { mapIds } from "../models/IdDTO";

// import { ListGetRequest, validateListGetResponse } from "../models/ListingDTO";

export class AmlMarketplaceAPI implements MarketplaceAPI {
    private readonly gateway: Gateway;

    constructor(storeUrl: string) {
        this.gateway = new OzoneGateway(storeUrl); // may have to create a new gateway? Not sure how authentication is going to work out
    }

    storeListingAsDashboard(stackID: number, dashListing: any): Promise<Dashboard | undefined> {
        return new Promise(() => {
            return undefined;
        });
    }

    storeListingAsStack(stackID: number, stackListing: any): Promise<Stack | undefined> {
        return new Promise(() => {
            return undefined;
        });
    }

    listingAsSimpleNewStack(listing: any): StackUpdateRequest | undefined {
        return undefined;
    }

    getAllUniqueWidgetsFromStackListing(listing: any): Promise<Widget[]> {
        return new Promise(() => {
            return [];
        });
    }

    storeListingAsWidget(listing: any): Promise<Widget | undefined> {
        return new Promise(() => {
            return undefined;
        });
    }

    getListingType(listing: any): "widget" | "dash" | "stack" | undefined {
        return undefined;
    }

    uploadStack(stack: Stack): Promise<{ success: boolean; message: string }> {
        return new Promise(() => {
            return { success: false, message: "Not implemented" };
        });
    }
}
