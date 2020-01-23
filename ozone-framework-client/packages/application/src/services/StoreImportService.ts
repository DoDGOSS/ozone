import { Intent } from "@blueprintjs/core";
import { Widget } from "../models/Widget";
import { authService } from "./AuthService";
import { storeMetaService } from "./StoreMetaService";
import { widgetCreateRequestFromWidget, widgetFromJson, widgetUpdateRequestFromWidget } from "../codecs/Widget.codec";
import { widgetApi } from "../api/clients/WidgetAPI";
import { stackApi } from "../api/clients/StackAPI";
import { MarketplaceAPI } from "../api/clients/MarketplaceAPI";
import { mainStore } from "../stores/MainStore";
import { showToast } from "../components/toaster/Toaster";
import { AuthUserDTO } from "../api/models/AuthUserDTO";
import { dashboardStore } from "../stores/DashboardStore";
import { isNil } from "../utility";
import { dashboardService } from "./DashboardService";
import { Response } from "../api/interfaces";
import { WidgetDTO } from "../api/models/WidgetDTO";
import { Stack } from "../models/Stack";

export interface InfractingItemUrl {
    type: "stack" | "dashboard" | "widget";
    name: string;
    url: string;
}

class StoreImportService {
    async importListing(store: Widget, listing: any): Promise<void> {
        const importingUser: AuthUserDTO = (await authService.check()).data;
        if (!importingUser || !importingUser.isAdmin) {
            showToast({
                message: "ERROR: Please ask an Ozone Administrator to import " + listing.title + " from " + store.title,
                intent: Intent.DANGER
            });
            return;
        }

        const marketplaceAPI: MarketplaceAPI | undefined = storeMetaService.getStoreApi(store);
        if (!marketplaceAPI) {
            showToast({
                message: "Error: Could not access API for " + store.title,
                intent: Intent.DANGER
            });
            return;
        }

        const listingType: string | undefined = marketplaceAPI.getListingType(listing);

        if (listingType === "Widget" || listingType === "widget") {
            await this.importWidget(importingUser, marketplaceAPI, listing, true);
        } else if (listingType === "Dashboard" || listingType === "dashboard" || listingType === "dash") {
            /* At this point, we have the Listing Type of Dashboard, but we do not have a COA such that a user with a store would 
               Import just a Dashboard, as a dashboard must reside in a Stack.  We are leaving this open as a possible future enhancement. */
        } else if (listingType === "Web Application" || listingType === "Stack" || listingType === "stack") {
            await this.importStack(marketplaceAPI, listing, importingUser);
        } else {
            showToast({
                message: "Error: Unknown Widget Type for Import!",
                intent: Intent.DANGER
            });
            console.log("Unknown item from import:", listing);
        }
    }

    async importWidget(
        importingUser: AuthUserDTO,
        marketplaceAPI: MarketplaceAPI,
        listing: any,
        isSingleWidgetImport?: boolean
    ): Promise<void> {
        listing = await marketplaceAPI.cleanUpAndVerifyStoreListing(listing);
        const widget = await marketplaceAPI.storeListingAsWidget(listing);
        if (!widget) {
            console.log(
                "Warning: The widget '" +
                    listing.title +
                    "' already exists in Ozone and is already at the latest version. Nothing was imported."
            );
            showToast({
                message:
                    "The widget '" +
                    listing.title +
                    "' already exists in Ozone and is already at the latest version. Nothing was imported.",
                intent: Intent.WARNING
            });
            return;
        }

        const savedWidget = await this.saveStoreWidget(widget);
        if (!savedWidget) {
            console.log("Error: Widget '" + listing.title + "' could NOT be imported.");
            showToast({
                message: "Error: Widget '" + listing.title + "' could NOT be imported.",
                intent: Intent.DANGER
            });
            return;
        }

        showToast({
            message: "Widget '" + savedWidget.title + "' has been imported.",
            intent: Intent.SUCCESS
        });

        if (savedWidget.id) {
            await widgetApi.addWidgetUsers(savedWidget.id!, importingUser.id);
        }

        // Open the Widget Admin page if this is a single widget import so we can possibly update the newly added widget.
        if (isSingleWidgetImport) {
            const widgetAdminWidget = dashboardStore.findUserWidgetByUniversalName(
                "org.ozoneplatform.owf.admin.WidgetAdmin"
            );
            if (!isNil(widgetAdminWidget) && !dashboardService.isWidgetAlreadyAdded({ widget: widgetAdminWidget })) {
                dashboardService.addWidget({ widget: widgetAdminWidget });
            } else {
                console.log("Attempted to open the Widget Admin Widget, but failed.");
            }
        }
    }

    private async importStack(marketplaceAPI: MarketplaceAPI, listing: any, importingUser: AuthUserDTO): Promise<void> {
        const listingTitle = listing.title;
        listing = await marketplaceAPI.cleanUpAndVerifyStoreListing(listing);
        if (!listing) {
            console.log("Error: The Store Listing '" + listingTitle + "' cannot be imported.");
            showToast({
                message: "Error: The Store Listing '" + listingTitle + "' cannot be imported.",
                intent: Intent.DANGER
            });
            return;
        }

        const stackFromListing: Stack | undefined = await marketplaceAPI.storeListingAsStack(
            listing,
            importingUser,
            marketplaceAPI
        );

        if (!stackFromListing) {
            showToast({
                message: "Stack '" + listing.title + "' is already up to date.",
                intent: Intent.PRIMARY
            });
            return;
        }

        const response = await stackApi.updateStack(stackFromListing);

        if (response.status !== 200 || !response.data) {
            showToast({
                message:
                    "Error: Unable to create or update Stack '" +
                    stackFromListing.name +
                    "' Contact Your Administrator.",
                intent: Intent.DANGER
            });
        } else {
            showToast({
                message: "Stack `" + stackFromListing.name + "` has been created or updated!",
                intent: Intent.SUCCESS
            });
        }
        mainStore.hideStore();
    }

    private async saveStoreWidget(widget: Widget): Promise<Widget | undefined> {
        try {
            let response: Response<WidgetDTO>;
            if (!widget) {
                throw new Error("Could not load data to convert widget");
            }
            if (widget.id) {
                response = await widgetApi.updateWidget(widgetUpdateRequestFromWidget(widget));
            } else {
                response = await widgetApi.createWidget(widgetCreateRequestFromWidget(widget));
            }
            return widgetFromJson(response.data);
        } catch (e) {
            showToast({
                message: typeof e.response.data === "string" ? e.response.data : "Error in importing widget.",
                intent: Intent.DANGER
            });
            console.log("Widget could not be imported because of an error.");
            return undefined;
        }
    }
}

export const storeImportService = new StoreImportService();
