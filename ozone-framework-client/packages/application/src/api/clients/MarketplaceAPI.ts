import { Widget } from "../../models/Widget";
import { Dashboard } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";
import { StackDTO } from "../models/StackDTO";
import { Intent } from "@blueprintjs/core";
import { AuthUserDTO } from "../models/AuthUserDTO";

export abstract class MarketplaceAPI {
    abstract getListingType(listing: any): string | undefined;

    abstract async storeListingAsDashboard(
        listing: any,
        importingUser: AuthUserDTO,
        stackId: number,
        marketplaceAPI: MarketplaceAPI
    ): Promise<Dashboard | undefined>;

    abstract async storeListingAsStack(
        stackID: number,
        stackListing: any,
        marketplaceAPI: MarketplaceAPI
    ): Promise<Stack | undefined>;

    abstract async cleanUpAndVerifyStoreListing(listing: any): Promise<any | undefined>;

    abstract listingAsSimpleNewStack(listing: any): StackDTO | undefined;

    abstract async getAllUniqueWidgetsFromStackListing(listing: any): Promise<Widget[]>;

    abstract uploadStack(stack: Stack): Promise<{ intent: Intent; message: string }>;

    abstract async storeListingAsWidget(listing: any): Promise<Widget | undefined>;

    abstract storeListingHasNecessaryFields(listing: any): boolean;
}
