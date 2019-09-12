import { Intent } from "@blueprintjs/core";

import { Widget } from "../models/Widget";
import { Stack } from "../models/Stack";

import { storeMetaService } from "./StoreMetaService";

import { storeMetaAPI } from "../api/clients/StoreMetaAPI";
import { MarketplaceAPI } from "../api/clients/MarketplaceAPI";

import { mainStore } from "../stores/MainStore";
import { dashboardStore } from "../stores/DashboardStore";

import { showToast } from "../components/toaster/Toaster";
import { showUrlCheckDialog } from "../components/confirmation-dialog/showUrlCheckDialog";

export interface InfractingItemUrl {
    type: "stack" | "dashboard" | "widget";
    name: string;
    url: string;
}

class StoreExportService {
    async uploadStack(stackID: number, store: Widget): Promise<void> {
        // Taking input of stackID instead of actual stack means they'll need to save any changes before
        // pushing their current stack, else those changes won't get pushed.
        // Do that automatically, or show notification.
        const allUserStacks = dashboardStore.userDashboards().value.stacks;
        const stack = allUserStacks[stackID];

        if (!stack) {
            console.log("Error in getting requested stack from the current user's permitted stack.");
            return new Promise(() => {
                return;
            });
        }

        if (stack.getWidgets().length === 0) {
            showToast({
                message: "Cannot push a stack with no widgets",
                intent: Intent.DANGER
            });
            return new Promise(() => {
                return;
            });
        }

        // check that all urls are fully-qualified.
        // Stores are remote, and so can't use local urls.
        if (!this.stackUrlsValid(stack)) {
            console.log("Attempted to push a Stack with invalid URLs.");
            return new Promise(() => {
                return;
            });
        }

        this.checkStoreAndUploadStack(stack, store);
    }

    private checkStoreAndUploadStack(stack: Stack, store: Widget): Promise<Widget | undefined> {
        const storeUrlPackage = storeMetaService.getStoreUrlPackage(store);

        // check that the store is available
        return storeMetaAPI.importStore(storeUrlPackage, (checkedStore: Widget) => {
            return this.uploadStackToStore(checkedStore, stack);
        });
    }

    private uploadStackToStore(store: Widget, stack: Stack): void {
        const marketplaceAPI: MarketplaceAPI | undefined = storeMetaService.getStoreApi(store);
        if (!marketplaceAPI) {
            return;
        }

        marketplaceAPI.uploadStack(stack).then((response: { success: boolean; message: string }) => {
            if (response.success === true) {
                showToast({
                    message: response.message,
                    intent: Intent.SUCCESS
                });
                mainStore.refreshStore();
                mainStore.showStore();
                mainStore.hideStackDialog();
            } else {
                showToast({
                    message: response.message,
                    intent: Intent.DANGER
                });
            }
        });
    }

    private stackUrlsValid(stack: Stack): boolean {
        const itemsWithInvalidUrls: InfractingItemUrl[] = [];

        this.checkUrl(itemsWithInvalidUrls, "stack", stack.name, stack.descriptorUrl);

        for (const dashGuid in stack.dashboards) {
            if (!stack.dashboards.hasOwnProperty(dashGuid)) {
                continue;
            }
            const dash = stack.dashboards[dashGuid].state().value;

            this.checkUrl(itemsWithInvalidUrls, "dashboard", dash.name, dash.imageUrl);

            for (const pID in dash.panels) {
                if (!dash.panels.hasOwnProperty(pID)) {
                    continue;
                }
                const panel = dash.panels[pID].state().value;
                for (const w of panel.widgets) {
                    if (!w.userWidget) {
                        // undefined if it used to hold a widget that's since been deleted.
                        // Should not be happening. Deletion should delete. Not half-delete.
                        continue;
                    }
                    const widget = w.userWidget.widget;
                    this.checkUrl(itemsWithInvalidUrls, "widget", widget.title, widget.url);
                    this.checkUrl(itemsWithInvalidUrls, "widget", widget.title, widget.descriptorUrl);
                    this.checkUrl(itemsWithInvalidUrls, "widget", widget.title, widget.images.smallUrl);
                    this.checkUrl(itemsWithInvalidUrls, "widget", widget.title, widget.images.largeUrl);
                }
            }
        }
        if (itemsWithInvalidUrls.length > 0) {
            showUrlCheckDialog({
                items: itemsWithInvalidUrls
            });
            return false;
        }
        return true;
    }

    private checkUrl(
        badList: InfractingItemUrl[],
        type: "stack" | "dashboard" | "widget",
        name: string,
        url: string | undefined
    ): void {
        if (url === undefined || url === null || url === "") {
            // ????
            return;
        }

        // for IE11... From https://stackoverflow.com/a/30867255/3015812
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(searchString, position) {
                position = position || 0;
                return this.indexOf(searchString, position) === position;
            };
        }

        // Duplicate input likely; check if that particular line item is already on the list
        if (badList.find((item: any) => item.type === type && item.name === name && item.url === url)) {
            return;
        }

        if (!url.startsWith("http")) {
            badList.push({ type, name, url });
        }
    }
}

export const storeExportService = new StoreExportService();
