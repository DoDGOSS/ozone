import { Intent } from "@blueprintjs/core";

import { Widget } from "../models/Widget";
import { Dashboard } from "../models/Dashboard";

import { authService } from "./AuthService";
import { storeMetaService } from "./StoreMetaService";

import { widgetCreateRequestFromWidget, widgetFromJson, widgetUpdateRequestFromWidget } from "../codecs/Widget.codec";

import { widgetApi } from "../api/clients/WidgetAPI";
import { DashboardCreateOpts, userDashboardApi } from "../api/clients/UserDashboardAPI";
import { stackApi } from "../api/clients/StackAPI";

import { StackCreateRequest, StackUpdateRequest } from "../api/models/StackDTO";

import { MarketplaceAPI } from "../api/clients/MarketplaceAPI";

import { mainStore } from "../stores/MainStore";

import { showToast } from "../components/toaster/Toaster";
import { AuthUserDTO } from "../api/models/AuthUserDTO";
import { dashboardStore } from "../stores/DashboardStore";
import { isNil } from "../utility";
import { dashboardService } from "./DashboardService";
import { Response } from "../api/interfaces";
import { WidgetDTO } from "../api/models/WidgetDTO";

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
            await this.importWidget(marketplaceAPI, listing, true);
        } else if (listingType === "Dashboard" || listingType === "dashboard" || listingType === "dash") {
            // TODO: IMPLEMENT dashboards for AML, something like:
            // const dashboard = marketplaceAPI.storeListingAsDashboard(listing);
            // something.saveContainedWidgets
            // something.saveDash with stack as current stack, and current widgets.?
        } else if (listingType === "Web Application" || listingType === "Stack" || listingType === "stack") {
            await this.importStack(marketplaceAPI, listing, importingUser);
        } else {
            showToast({
                message: "Error: Unknown Widget Type for Import!",
                intent: Intent.SUCCESS
            });
            console.log("Unknown item from import:", listing);
        }
    }

    private async importWidget(
        marketplaceAPI: MarketplaceAPI,
        listing: any,
        isSingleWidgetImport?: boolean
    ): Promise<void> {
        if (!marketplaceAPI.storeListingHasNecessaryFields(listing)) {
            console.log("Error: The Store Listing '" + listing.title + "' is missing some required fields for import.");
            showToast({
                message: "Error: The Store Listing '" + listing.title + "' is missing some required fields for import.",
                intent: Intent.DANGER
            });
            return;
        }

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
        const basicStackInfo: StackUpdateRequest | undefined = marketplaceAPI.listingAsSimpleNewStack(listing);
        if (!basicStackInfo) {
            showToast({
                message: "Error: Stack '" + listing.title + "' could NOT be imported.",
                intent: Intent.DANGER
            });
            console.log("Couldn't get basic info.");
            return;
        }

        let stackExists: boolean = false;
        const stacksResponse = await stackApi.getStacks();
        if (!(stacksResponse.status >= 200 && stacksResponse.status < 400)) {
            return;
        }
        for (const s of stacksResponse.data.data) {
            if (s.stackContext === basicStackInfo.stackContext) {
                basicStackInfo.id = s.id;
                stackExists = true;
                break;
            }
        }

        const stackID: number | undefined = await this.saveBasicStackInfo(basicStackInfo, !stackExists);
        if (!stackID) {
            return;
        }

        // need all widgets to exist before creating dashboards in storeListingAsStack()
        const stackWidgets = await marketplaceAPI.getAllUniqueWidgetsFromStackListing(listing);
        let savedWidgets = 0;
        for (const widget of stackWidgets) {
            const savedWidget = await this.saveStoreWidget(widget);

            if (!savedWidget) {
                console.log("Could not import/save widget `", widget.universalName, "`");
                continue;
            }

            const giveWidgetToCurrentUserResponse = await widgetApi.addWidgetUsers(savedWidget.id!, importingUser.id);

            if (!(giveWidgetToCurrentUserResponse.status >= 200 && giveWidgetToCurrentUserResponse.status < 400)) {
                console.log("Could not give current user access to widget '", widget.universalName, "'");
            }
            savedWidgets += 1;
        }
        if (savedWidgets === stackWidgets.length) {
            showToast({
                message: "All stack widgets has been saved/updated",
                intent: Intent.SUCCESS
            });
        } else if (savedWidgets > 1) {
            showToast({
                message: "Some widgets could not be saved.",
                intent: Intent.WARNING
            });
        } else if (savedWidgets === 0) {
            showToast({
                message: "Error saving stack widgets.",
                intent: Intent.DANGER
            });
        }

        const stack = await marketplaceAPI.storeListingAsStack(stackID, listing);
        if (!stack) {
            console.log("Couldn't import stack");
            return;
        }

        let firstDashGuid;

        for (const dash of stack.getDashboards()) {
            // need to wait to let the backend update between calls.
            // Probs shouldn't have to, but apparently we do.
            await new Promise((resolve) => setTimeout(resolve, 800));

            const dashGuid: string | undefined = await this.saveStoreDashboard(dash, stackID, stack.name);
            if (firstDashGuid === undefined && dashGuid) {
                firstDashGuid = dashGuid;
            }
        }

        // retain this comment for future AML dev.
        // switchToStack
        // if (firstDashGuid !== undefined) {
        // } else {
        // }
        mainStore.hideStore();
    }

    private async saveBasicStackInfo(stackInfo: StackUpdateRequest, saveAsNew: boolean): Promise<number | undefined> {
        let response;
        if (saveAsNew) {
            const stackCreateInfo: StackCreateRequest = {
                name: stackInfo.name,
                approved: stackInfo.approved,
                stackContext: stackInfo.stackContext,
                descriptorUrl: stackInfo.descriptorUrl,
                description: stackInfo.description
            };

            response = await stackApi.createStack(stackCreateInfo);
            showToast({
                message: "Stack `" + stackCreateInfo.name + "` has been created",
                intent: Intent.SUCCESS
            });
        } else {
            response = await stackApi.updateStack(stackInfo);
            showToast({
                message: "Stack `" + stackInfo.name + "` has been updated",
                intent: Intent.SUCCESS
            });
        }

        if (!(response.status >= 200 && response.status < 400)) {
            console.log("Could not import stack.");
            showToast({
                message: "Stack `" + stackInfo.name + "` could not be imported.",
                intent: Intent.SUCCESS
            });
            return undefined;
        }
        return response.data.id;
    }

    private async saveStoreDashboard(dash: Dashboard, stackID: number, stackName: string): Promise<string | undefined> {
        try {
            const dashWithStackInfo: DashboardCreateOpts = {
                name: dash.state().value.name,
                tree: dash.state().value.tree,
                panels: dash.state().value.panels,
                backgroundWidgets: dash.state().value.backgroundWidgets,
                stackId: stackID,
                stackName: stackName
            };

            const response = await userDashboardApi.createDashboard(dashWithStackInfo);
            if (!(response.status >= 200 && response.status < 400)) {
                console.log("Could not create dashboard ", dash.state().value.name);
                return undefined;
            }

            return response.data.guid;
        } catch (e) {
            console.log("Something went wrong in saving dashboard ", dash.state().value.name);
            return undefined;
        }
    }

    private async saveStoreWidget(widget: Widget): Promise<Widget | undefined> {
        try {
            let response: Response<WidgetDTO>;
            if (!widget) {
                throw new Error("Could not load data to convert widget");
            }
            console.log("we have widget: " + JSON.stringify(widget));
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
