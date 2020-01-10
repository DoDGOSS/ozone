import { Widget } from "../../models/Widget";
import { Dashboard } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";
import { StackDTO } from "../models/StackDTO";
import { Intent } from "@blueprintjs/core";

export abstract class MarketplaceAPI {
    // abstract getWidget(widgetId: string): Widget; // may need this and others to implement sync.

    abstract getListingType(listing: any): string | undefined;

    abstract storeListingAsDashboard(stackID: number, dashListing: any): Promise<Dashboard | undefined>;

    abstract storeListingAsStack(stackID: number, stackListing: any): Promise<Stack | undefined>;

    abstract listingAsSimpleNewStack(listing: any): StackDTO | undefined;

    abstract getAllUniqueWidgetsFromStackListing(listing: any): Promise<Widget[]>;

    abstract uploadStack(stack: Stack): Promise<{ intent: Intent; message: string }>;

    abstract storeListingAsWidget(listing: any): Promise<Widget | undefined>;

    abstract storeListingHasNecessaryFields(listing: any): boolean;
}
