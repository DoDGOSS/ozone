import { Intent } from "@blueprintjs/core";

import { Widget } from "../models/Widget";
import { Dashboard } from "../models/Dashboard";

import { dashboardService } from "./DashboardService";
import { authService } from "./AuthService";
import { storeMetaService } from "./StoreMetaService";

import { widgetCreateRequestFromWidget, widgetFromJson, widgetUpdateRequestFromWidget } from "../codecs/Widget.codec";

import { widgetApi } from "../api/clients/WidgetAPI";
import { DashboardCreateOpts, userDashboardApi } from "../api/clients/UserDashboardAPI";
import { stackApi } from "../api/clients/StackAPI";

import { StackCreateRequest, StackUpdateRequest } from "../api/models/StackDTO";

import { MarketplaceAPI } from "../api/clients/MarketplaceAPI";

import { mainStore } from "../stores/MainStore";
import { dashboardStore } from "../stores/DashboardStore";

import { showToast } from "../components/toaster/Toaster";

export interface InfractingItemUrl {
    type: "stack" | "dashboard" | "widget";
    name: string;
    url: string;
}

class StoreImportService {
    async importListing(store: Widget, listing: any): Promise<void> {
        const marketplaceAPI: MarketplaceAPI | undefined = storeMetaService.getStoreApi(store);
        if (!marketplaceAPI) {
            return;
        }

        const listingType: "widget" | "dash" | "stack" | undefined = marketplaceAPI.getListingType(listing);

        if (listingType === "widget") {
            this.importWidget(marketplaceAPI, listing);
        } else if (listingType === "dash") {
            // TODO: IMPLEMENT dashboards for AML, something like:
            // const dashboard = marketplaceAPI.storeListingAsDashboard(listing);
            // something.saveContainedWidgets
            // something.saveDash with stack as current stack, and current widgets.?
        } else if (listingType === "stack") {
            this.importStack(marketplaceAPI, listing);
        } else {
            console.log("Unknown item from import:", listing);
        }
    }

    private async importWidget(marketplaceAPI: MarketplaceAPI, listing: any): Promise<void> {
        const widget: Widget | undefined = await marketplaceAPI.storeListingAsWidget(listing);
        if (!widget) {
            return;
        }
        const savedWidget = await this.saveStoreWidget(widget);
        if (!savedWidget) {
            return;
        }
        dashboardService.addWidgetSimple(savedWidget); // adds to current dash

        showToast({
            message: "Widget `" + savedWidget.title + "` has been imported.",
            intent: Intent.SUCCESS
        });
    }

    private async importStack(marketplaceAPI: MarketplaceAPI, listing: any): Promise<void> {
        const importingUser = (await authService.check()).data;

        const basicStackInfo: StackUpdateRequest | undefined = marketplaceAPI.listingAsSimpleNewStack(listing);
        if (!basicStackInfo) {
            console.log("Couldn't get basic info.");
            return;
        }

        let stackExists: boolean = false;
        const stacksResponse = await stackApi.getStacks();
        if (stacksResponse.status !== 200) {
            return;
        }
        for (const s of stacksResponse.data.data) {
            if (s.stackContext === basicStackInfo.stackContext) {
                basicStackInfo.id = s.id;
                stackExists = true;
                break;
            }
        }

        console.log(stackExists);
        const stackID: number | undefined = await this.saveBasicStackInfo(basicStackInfo, !stackExists);
        if (!stackID) {
            return;
        }
        console.log("Here");

        // need all widgets to exist before creating dashboards in storeListingAsStack()
        const stackWidgets = await marketplaceAPI.getAllUniqueWidgetsFromStackListing(listing);
        let savedWidgets = 0;
        for (const widget of stackWidgets) {
            const savedWidget = await this.saveStoreWidget(widget);

            if (!savedWidget) {
                console.log("Could not import/save widget `", widget.universalName, "`");
                continue;
            }

            const giveWidgetToCurrentUserResponse = await widgetApi.addWidgetUsers(savedWidget.id, importingUser.id);

            if (giveWidgetToCurrentUserResponse.status !== 200) {
                console.log("Could not give current user access to widget `", widget.universalName, "`");
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

        if (response.status !== 200 || !response.data.data || !(response.data.data.length > 0)) {
            console.log("Could not import stack.");
            showToast({
                message: "Stack `" + stackInfo.name + "` could not be imported.",
                intent: Intent.SUCCESS
            });
            return undefined;
        }
        return response.data.data[0].id;
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
            if (response.status !== 200) {
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
            let response: any;
            if (!widget) {
                throw new Error("Could not load data to convert widget");
            }

            if (widget.id && widget.id !== "") {
                response = await widgetApi.updateWidget(await widgetUpdateRequestFromWidget(widget));
            } else {
                response = await widgetApi.createWidget(await widgetCreateRequestFromWidget(widget));
            }
            return widgetFromJson(response.data.data[0]);
        } catch (e) {
            showToast({
                message: typeof e.response.data === "string" ? e.response.data : "Error in importing widget.",
                intent: Intent.DANGER
            });
            return undefined;
        }
    }
}

export const storeImportService = new StoreImportService();
