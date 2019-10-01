import * as qs from "qs";

import { Widget } from "../../models/Widget";
import { Dashboard } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";
import { StackUpdateRequest } from "../models/StackDTO";

export abstract class MarketplaceAPI {
    // abstract getWidget(widgetId: string): Widget; // may need this and others to implement sync.

    abstract getListingType(listing: any): string | undefined;

    abstract storeListingAsDashboard(stackID: number, dashListing: any): Promise<Dashboard | undefined>;

    abstract storeListingAsStack(stackID: number, stackListing: any): Promise<Stack | undefined>;

    abstract listingAsSimpleNewStack(listing: any): StackUpdateRequest | undefined;

    abstract getAllUniqueWidgetsFromStackListing(listing: any): Promise<Widget[]>;

    abstract uploadStack(stack: Stack): Promise<{ success: boolean; message: string }>;

    abstract storeListingAsWidget(listing: any): Widget | undefined;

    abstract storeListingHasNecessaryFields(listing: any): boolean;
}
