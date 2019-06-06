import { Intent } from "@blueprintjs/core";

import { MosaicPath } from "../features/MosaicDashboard/types";

import { DashboardNode, DashboardPath } from "../components/widget-dashboard/types";

import { ExpandoPanel, FitPanel, LayoutType, Panel, PanelState, TabbedPanel } from "../models/panel";

import { Widget } from "../models/Widget";
import { AddWidgetOpts, Dashboard, DashboardProps } from "../models/Dashboard";
import { Stack } from "../models/Stack";
import { WidgetType } from "../models/WidgetType";

import { UserWidget } from "../models/UserWidget";
import { dashboardService } from "./DashboardService";
import { authService } from "./AuthService";

import { dashboardToCreateRequest, dashboardToUpdateRequest } from "../codecs/Dashboard.codec";
import { widgetCreateRequestFromWidget, widgetFromJson, widgetUpdateRequestFromWidget } from "../codecs/Widget.codec";

import { widgetApi } from "../api/clients/WidgetAPI";
import { widgetTypeApi } from "../api/clients/WidgetTypeAPI";
import { dashboardApi } from "../api/clients/DashboardAPI";
import { DashboardCreateOpts, userDashboardApi } from "../api/clients/UserDashboardAPI";
import { stackApi } from "../api/clients/StackAPI";

import { WidgetDTO } from "../api/models/WidgetDTO";
import { DashboardDTO } from "../api/models/DashboardDTO";
import { StackCreateRequest, StackDTO, StackUpdateRequest } from "../api/models/StackDTO";
import { WidgetTypeDTO } from "../api/models/WidgetTypeDTO";

import { storeMetaAPI } from "../api/clients/StoreMetaAPI";
import { MarketplaceAPI } from "../api/clients/MarketplaceAPI";
import { AmlMarketplaceAPI } from "../api/clients/AmlMarketplaceAPI";
import { OmpMarketplaceAPI } from "../api/clients/OmpMarketplaceAPI";

import { mainStore } from "../stores/MainStore";
import { dashboardStore } from "../stores/DashboardStore";

import { showToast } from "../components/toaster/Toaster";
import { showConfirmationDialog } from "../components/confirmation-dialog/showConfirmationDialog";
import { showStoreSelectionDialog } from "../components/confirmation-dialog/showStoreSelectionDialog";
import { showUrlCheckDialog } from "../components/confirmation-dialog/showUrlCheckDialog";

import { isNil, Predicate, uuid, values } from "../utility";

export interface InfractingItemUrl {
    type: "stack" | "dashboard" | "widget";
    name: string;
    url: string;
}

class StoreMetaService {
    async saveOrUpdateStore(store: Widget): Promise<any> {
        if (store.id === undefined || store.id === "") {
            return widgetApi.createWidget(await widgetCreateRequestFromWidget(store));
        } else {
            return widgetApi.updateWidget(await widgetUpdateRequestFromWidget(store));
        }
    }

    cleanStoreUrl(storeUrl: string): string {
        if (storeUrl[-1] === "/") {
            const cleanedUrl = storeUrl.slice(0, -1);
            return cleanedUrl;
        } else {
            return storeUrl;
        }
    }

    getStoreApi(universalName: string, storeUrl: string): MarketplaceAPI | undefined {
        const type = this.getStoreType(universalName);
        if (type === "omp") {
            return new OmpMarketplaceAPI(this.cleanStoreUrl(storeUrl));
        } else if (type === "aml") {
            return new AmlMarketplaceAPI(this.cleanStoreUrl(storeUrl));
        }
        console.log("Tags missing on widget identifier; couldn't use as a store.");
        return undefined;
    }

    private getStoreType(universalName: string): string {
        const storeID = universalName.slice(10); // cut off `store:___:`

        if (universalName.startsWith("store:omp:")) {
            return "omp";
        }
        if (universalName.startsWith("store:aml:")) {
            return "aml";
        } else {
            return "";
        }
    }
}

export const storeMetaService = new StoreMetaService();
