/* tslint:disable:member-ordering */
import * as qs from "qs";

import { OzoneGateway } from "../../services/OzoneGateway";
import { Gateway, getGateway, Response } from "../interfaces";

import { MarketplaceAPI } from "./MarketplaceAPI";
import { widgetApi } from "./WidgetAPI";
import { widgetTypeApi } from "./WidgetTypeAPI";
import { userWidgetApi } from "./UserWidgetAPI";

import { dashboardStore } from "../../stores/DashboardStore";

import { authService } from "../../services/AuthService";
import { dashboardService, mosaicPathFromCode, mosaicPositionFromCode } from "../../services/DashboardService";

import { MosaicDropTargetPosition } from "../../shared/dragAndDrop";

import { widgetFromJson } from "../../codecs/Widget.codec";
import { intentFromJson } from "../../codecs/Intent.codec";

import { StackUpdateRequest } from "../models/StackDTO";
import { IntentDTO, IntentsDTO } from "../models/IntentDTO";

import {
    ExpandoPanel,
    ExpandoPanelState,
    FitPanel,
    Panel,
    PanelState,
    TabbedPanel,
    TabbedPanelState
} from "../../models/panel";
import { Widget } from "../../models/Widget";
import { Intent } from "../../models/Intent";
import { Dashboard } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";
import { WidgetInstance } from "../../models/WidgetInstance";
// import { Panel } from "../../models/panel/types";
// import { FitPanel } from "../../models/panel/FitPanel";
// import { TabbedPanel } from "../../models/panel/TabbedPanel";
// import { ExpandoPanel } from "../../models/panel/ExpandoPanel";

import { cleanNullableProp, uuid } from "../../utility";
import { DashboardLayout } from "../../components/widget-dashboard/types";

export class OmpMarketplaceAPI {
    private readonly gateway: Gateway;

    constructor(storeUrl: string) {
        this.gateway = new OzoneGateway(storeUrl); // may have to create a new gateway? Not sure how authentication is going to work out
    }

    // /*
    //  * Used when pulling down a dashboard or stack.
    //  */
    // async getWidget(widgetId: string): Widget {
    //     return undefined;
    // }

    // /*
    //  * Used when pulling down a stack. ???
    //  */
    // async getDashboard(dashboardId: string): Dashboard {
    //     return undefined;
    // }

    /*
     *
     */
    getListingType(listing: any): "widget" | "dash" | "stack" | undefined {
        if (!listing.owfProperties) {
            return undefined;
        }

        if (listing.owfProperties) {
            // check inside here, since we'll need the owfProperties to actually build the thing.
            // If they're not there, we have a problem.
            if (listing.types) {
                switch (listing.types.title) {
                    case "App Component":
                        return "widget";
                    case "OZONE App":
                        return "stack";
                    default:
                        break;
                }
            }
            // I don't think you can get just dashboards out of OWF. Only widgets and stacks.
            if (listing.owfProperties.stackDescriptor === null) {
                return "widget";
            } else {
                return "stack";
            }
        }
    }

    /*
     *
     */
    async storeListingAsWidget(listing: any): Promise<Widget | undefined> {
        const [cleanID, cleanUniversalName] = await this.getCleanIdAndUniversalName(
            listing.owfProperties.universalName,
            listing.title
        );
        if (cleanUniversalName === "") {
            return undefined;
        }
        return {
            id: cleanID,
            description: listing.description,
            images: {
                smallUrl: listing.imageSmallUrl,
                largeUrl: listing.imageLargeUrl
            },
            intents: this.convertStoreIntents(listing.intents),
            isBackground: listing.owfProperties.background,
            isDefinitionVisible: true, // what is this?
            isMaximized: false, // no data for this
            isMinimized: false, // no data for this
            isMobileReady: listing.owfProperties.mobileReady,
            isSingleton: listing.owfProperties.singleton,
            isVisible: listing.owfProperties.visibleInLaunch, // ?
            title: listing.title,
            types: [await widgetTypeApi.getWidgetType(listing.owfProperties.owfWidgetType)],
            universalName: cleanUniversalName,
            url: listing.launchUrl,
            version: listing.versionName,
            width: listing.owfProperties.width,
            height: listing.owfProperties.height,
            x: 0,
            y: 0
        };
        return listing.owfProperties;
    }

    //
    private convertStoreIntents(listingIntents: any[]): IntentsDTO {
        const intentsDto = {
            send: [],
            receive: []
        };
        for (const intent of listingIntents) {
            if (intent.send) {
                this.buildIntents(intent, intentsDto.send);
            }
            if (intent.receive) {
                this.buildIntents(intent, intentsDto.receive);
            }
        }
        return intentsDto;
    }

    private buildIntents(newIntent: any, intentList: IntentDTO[]): void {
        const action = newIntent.action.title;
        const dataType = newIntent.dataType.title;
        for (const intent of intentList) {
            if (action === intent.action) {
                if (intent.dataTypes.indexOf(dataType) === -1) {
                    intent.dataTypes.push(dataType);
                    return;
                }
            }
        }
        // else
        intentList.push({ action, dataTypes: [dataType] });
        return;
    }

    /*
     * Convert omp's dash to our Dashboard.
     */
    async storeListingAsDashboard(stackID: number, dashListing: any): Promise<Dashboard> {
        const importingUser = (await authService.check()).data;
        const newDash = new Dashboard({
            tree: null,
            panels: {},
            description: dashListing.description,
            guid: dashListing.guid,
            // imageUrl?: string;
            isAlteredByAdmin: true, // ?
            isDefault: dashListing.isDefault,
            isGroupDashboard: false,
            isLocked: dashListing.locked,
            isMarkedForDeletion: false,
            isPublishedToStore: true,
            name: dashListing.name,
            position: dashListing.dashboardPosition,
            stackId: stackID,
            user: {
                username: importingUser.username
            },
            backgroundWidgets: dashListing.backgroundWidgets
        });

        // For fitpanel, just check that there's one widget, and call addWidgetSimple.
        // for tabbed/accordian, add the first one, and then just add more widgets to that panel?
        // Will need to incorporate path.
        // Path is array. Set in panel loop. Just keep adding one, convert to binary, and translate that sequence into "first" | "second".
        let pathCode = 0;
        for (const storePanel of dashListing.layoutConfig.items) {
            const widgetInstances = [];
            for (const storeWidget of storePanel.widgets) {
                const [cleanID, cleanUniversalName] = await this.getCleanIdAndUniversalName(
                    storeWidget.universalName,
                    storeWidget.title
                );
                const userWidget = dashboardStore.findUserWidgetByUniversalName(cleanUniversalName);
                if (userWidget) {
                    widgetInstances.push(WidgetInstance.create(userWidget));
                } else {
                    console.log("User widget not found: ", storeWidget);
                }
            }

            const path = mosaicPathFromCode(pathCode);
            const mosaicPosition = mosaicPositionFromCode(pathCode);

            pathCode += 1;
            let newPanel: Panel | undefined;

            switch (storePanel.xtype) {
                case "fit":
                    newPanel = new FitPanel({
                        title: storePanel.name,
                        widget: widgetInstances.length > 0 ? widgetInstances[0] : undefined
                    });
                    break;
                case "tabbed":
                    newPanel = new TabbedPanel({
                        title: storePanel.name,
                        widgets: widgetInstances
                    });
                    break;
                case "portal":
                case "accordion":
                    newPanel = new ExpandoPanel(storePanel.xtype, {
                        title: storePanel.name,
                        widgets: widgetInstances
                    });
                    break;
            }

            if (newPanel) {
                newDash.addPanel(newPanel, path, mosaicPosition);
            }
        }

        return newDash;
    }

    /*
     *
     */
    listingAsSimpleNewStack(listing: any): StackUpdateRequest {
        const stackDescriptor = JSON.parse(listing.owfProperties.stackDescriptor);
        return {
            id: listing.id,
            name: stackDescriptor.name,
            approved: true,
            stackContext: stackDescriptor.stackContext,
            description: stackDescriptor.description,
            descriptorUrl: stackDescriptor.descriptorUrl
        };
    }

    /*
     * Create stack out of listing.
     * calls stackDescriptor url, gets list of dashboard IDs.
     * Call getDashboard on each ID, and add those dashboards to the new stack.
     */
    async storeListingAsStack(stackID: number, listing: any): Promise<Stack | undefined> {
        const stackDescriptor = JSON.parse(listing.owfProperties.stackDescriptor);
        const importingUser = (await authService.check()).data;

        const dashboards: Dictionary<Dashboard> = {};
        for (const storeDash of stackDescriptor.dashboards) {
            const dash = await this.storeListingAsDashboard(stackID, storeDash);
            if (dash) {
                dashboards[dash.guid] = dash;
            }
        }

        const stack = new Stack({
            approved: true,
            context: stackDescriptor.stackContext,
            dashboards: dashboards,
            description: stackDescriptor.description,
            id: stackID,
            name: stackDescriptor.name,
            owner: {
                username: importingUser.username
            }
        });
        return stack;
    }

    async getAllUniqueWidgetsFromStackListing(stackListing: any): Promise<Widget[]> {
        const stackDescriptor = JSON.parse(stackListing.owfProperties.stackDescriptor);

        const cleanedWidgets: Widget[] = [];
        for (const widget of stackDescriptor.widgets) {
            const [cleanID, cleanUniversalName] = await this.getCleanIdAndUniversalName(
                widget.universalName,
                widget.title
            );
            widget.widgetGuid = cleanID;
            widget.universalName = cleanUniversalName;
            const cleanedWidget = await this.widgetFromStackDescriptorWidgetFormat(widget);
            if (cleanedWidgets.find((w: Widget) => w.universalName === widget.universalName) === undefined) {
                cleanedWidgets.push(cleanedWidget);
            }
        }
        return cleanedWidgets;
    }

    private async widgetFromStackDescriptorWidgetFormat(widget: any): Promise<Widget> {
        // it's almost a WidgetCreateRequest, but naturally the 'types' field is the wrong type.
        return new Widget({
            // description: string;
            description: widget.description,
            // descriptorUrl?: string;
            descriptorUrl: widget.descriptorUrl,
            // widgetGuid: string;
            id: widget.widgetGuid,
            images: {
                // imageUrlSmall: string;
                smallUrl: widget.imageUrlSmall,
                // imageUrlMedium: string;
                largeUrl: widget.imageUrlMedium
            },
            // intents: IntentsDTO;
            intents: {
                send: widget.intents.send.map(intentFromJson),
                receive: widget.intents.receive.map(intentFromJson)
            },
            // background: boolean;
            isBackground: widget.background,
            isDefinitionVisible: true, // ?
            isMaximized: false,
            isMinimized: false,
            // mobileReady: boolean;
            isMobileReady: widget.mobileReady,
            // singleton: boolean;
            isSingleton: widget.singleton,
            // visible: boolean;
            isVisible: widget.visible,
            // displayName: string;
            title: widget.displayName,
            // universalName: string;
            universalName: widget.universalName,
            // widgetUrl: string;
            url: widget.widgetUrl,
            // widgetTypes: WidgetTypeReference[];
            types: await widgetTypeApi.widgetTypesAsList(widget.widgetTypes),
            // widgetVersion: string;
            version: widget.widgetVersion,
            // width: number;
            width: widget.width,
            // height: number;
            height: widget.height,
            x: 0,
            y: 0
        });
    }

    /*
     * upload all contained dashboards, and save an extra listing as the stack - as a stack type -, whose launchurl
     * is to an owf endpoint for downloading the list of dashboards that stack has.
     * E.g. the launchUrl could be OWF_URL/api/stackDescriptor/some-uuid
     */
    async uploadStack(stack: Stack): Promise<{ success: boolean; message: string }> {
        const storeStack = this.stackInStoreFormat(stack);

        if (storeStack.widgets.length === 0) {
            return new Promise(() => {
                return { success: false, message: "Cannot push a stack with no widgets" };
            });
        }

        const requestData = qs.stringify({
            data: JSON.stringify(storeStack)
        });
        return this.gateway
            .post("listing/", requestData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
            .then((response: any) => {
                let success: boolean;
                let message: string;

                if (response.status === 200) {
                    (message = response.data.data.msg), (success = true);
                } else {
                    message = response && response.data ? response.data : "Error in pushing store.";
                    success = false;
                }

                return { success, message };
            })
            .catch((error: any) => {
                let message: string = "Error in saving store.";
                try {
                    message = JSON.parse(JSON.stringify(error)).response.data.data;
                } catch (e) {
                    console.log("Error, and couldn't get failure message.");
                }

                return { success: false, message };
            });
    }

    private stackInStoreFormat(stack: Stack) {
        const storeStack: {
            name: string;
            stackContext: string;
            description: string | undefined | null;
            imageUrl: string | undefined | null;
            dashboards: any[];
            widgets: any[];
        } = {
            name: stack.name, // "pushable",
            stackContext: stack.context, // "ca5eec27-7026-483a-8d0b-de034b206334",
            description: stack.description, // null,
            imageUrl: stack.imageUrl, // null,
            dashboards: [],
            widgets: []
        };
        for (const widget of stack.getWidgets()) {
            storeStack.widgets.push(this.widgetInStoreFormat(widget));
        }

        for (const dashGuid in stack.dashboards) {
            if (!stack.dashboards.hasOwnProperty(dashGuid)) {
                continue;
            }
            const dash = this.dashboardInStoreFormat(stack.dashboards[dashGuid]);
            storeStack.dashboards.push(dash);
        }

        return storeStack;
    }

    private dashboardInStoreFormat(dashboardObject: Dashboard): any {
        const dashboard = dashboardObject.state().value;
        const panes = [];
        for (const panelID in dashboard.panels) {
            if (!dashboard.panels.hasOwnProperty(panelID)) {
                continue;
            }
            const panel = dashboard.panels[panelID].state().value;
            panes.push(this.getPanelInStoreLayoutFormat(dashboard.guid, panel));
        }
        return {
            name: dashboard.name,
            guid: dashboard.guid,
            description: dashboard.description,
            type: null,
            isdefault: false,
            locked: false,
            dashboardPosition: 7,
            layoutConfig: {
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                xtype: "container",
                flex: 3,
                cls: "hbox ",
                items: panes
            }
        };
    }

    private getPanelInStoreLayoutFormat(dashboardId: string, panel: PanelState) {
        const widgetLayouts = this.getWidgetLayouts(dashboardId, panel);
        const defaultSettings = this.getPanelDefaultSettings(panel);

        return {
            // note this doesn't use the panel's .name field.
            xtype: panel.type,
            flex: 1,
            cls: "left",
            widgets: widgetLayouts,
            items: [], // ?
            htmlText: "50%", // ?
            paneType: panel.type,
            defaultSettings: defaultSettings
        };
    }

    private getWidgetLayouts(dashboardId: string, panel: PanelState) {
        const widgetLayouts = [];
        for (let i = 0; i < panel.widgets.length; i++) {
            if (!panel.widgets[i].userWidget) {
                // undefined if it used to hold a widget that's since been deleted.
                continue;
            }
            widgetLayouts.push(this.getWidgetLayoutInStoreFormat(dashboardId, panel, i));
        }
        return widgetLayouts;
    }

    private getPanelDefaultSettings(panel: PanelState): any {
        if (panel.type === "fit") {
            return {};
        }
        const defaultSettings: { widgetStates: { [key: string]: any } } = {
            widgetStates: {}
        };
        for (const w of panel.widgets) {
            if (!w.userWidget) {
                // undefined if it used to hold a widget that's since been deleted.
                continue;
            }
            const widget = w.userWidget.widget;
            if (panel.type === "portal") {
                defaultSettings.widgetStates[widget.id] = {
                    width: "100%",
                    height: widget.height,
                    timestamp: Date.now() // in ms
                };
            } else if (panel.type === "tabbed") {
                defaultSettings.widgetStates[widget.id] = {
                    timestamp: Date.now() // in ms
                };
            }
        }
        return defaultSettings;
    }

    private getWidgetLayoutInStoreFormat(
        dashboardId: string,
        panel: PanelState | TabbedPanelState | ExpandoPanelState,
        widgetIndex: number
    ): any {
        if (!panel.widgets[widgetIndex] || !panel.widgets[widgetIndex].userWidget) {
            console.log("ERROR:", widgetIndex, "not in", panel.widgets);
            return undefined;
        }
        const widget: Widget = panel.widgets[widgetIndex].userWidget.widget;
        // only exists if panel is tabbedPanel or expando(portal/accordian)
        const widgetCollapsed: boolean =
            "collapsed" in panel && panel.collapsed && panel.collapsed.length > widgetIndex
                ? panel.collapsed[widgetIndex]
                : false;

        const active: boolean =
            "activeWidget" in panel && !!panel.activeWidget && panel.activeWidget.userWidget.widget.id === widget.id;
        return {
            pinned: false, // ?
            collapsed: widgetCollapsed, // ?
            widgetGuid: widget.id, //
            columnPos: widgetIndex, // always 0 for fit panels, I believe is the ordering for portals and tabs
            minimized: widget.isMinimized, //
            floatingWidget: false, // *
            buttonId: null, // *
            universalName: this.getOmpUniqueUniversalName(widget), //
            intentConfig: null, // *
            zIndex: 0, // only used for desktoppane, which we don't support at the moment
            height: widget.height, //
            singleton: widget.isSingleton, //
            maximized: widget.isMaximized, //
            active: active, // ?
            statePosition: widgetIndex + 1, //
            dashboardGuid: dashboardId, //
            buttonOpened: false, // *
            paneGuid: panel.id, //
            launchData: null, // ?
            name: widget.title, //
            x: widget.x, // 0,
            width: widget.width, // 924,
            y: widget.y, // 33,
            region: "none", // ?
            uniqueId: widget.id + panel.id // ?
        };
    }

    /*
     *
     */
    private widgetInStoreFormat(widget: Widget): any {
        const types: string[] = [];
        if (widget.types) {
            for (const type of widget.types) {
                types.push(type.name);
            }
        }
        return {
            widgetGuid: widget.id,
            descriptorUrl: widget.descriptorUrl,
            universalName: this.getOmpUniqueUniversalName(widget),
            displayName: widget.title,
            description: widget.description,
            widgetVersion: widget.version,
            widgetUrl: widget.url,
            imageUrlSmall: widget.images.smallUrl,
            imageUrlMedium: widget.images.smallUrl,
            imageUrlLarge: widget.images.largeUrl,
            width: widget.width,
            height: widget.height,
            visible: widget.isVisible,
            singleton: widget.isSingleton,
            background: widget.isBackground,
            mobileReady: widget.isMobileReady,
            widgetTypes: types,
            intents: widget.intents
        };
    }

    getOmpUniqueUniversalName(widget: Widget): string {
        // UniversalName is ID in store. Must be unique, and as unchangeable as possible from the frontend.
        // Convert it back when you pull it in.
        return widget.id + "_^_" + widget.universalName;
    }

    getIdAndUniversalNameFromOmpUName(ompUnivName: string): { id: string; universalName: string } {
        const pieces = ompUnivName.split("_^_");
        if (pieces.length === 2) {
            return {
                id: pieces[0],
                universalName: pieces[1]
            };
        } else {
            return {
                id: "",
                universalName: ompUnivName
            };
        }
    }

    /*
     * Widgets get saved with the primary key
     *  ompWidgetListing.universalName = widget.id + "_^_" + widget.universalName
     * If the listing's universalName is not in that format on load,
     * use the whole thing as its universal name, and request a new id.
     * Unless it has multiple of the token "_^_", in which case try to see if any of the pieces
     * match a known widget.
     */
    private async getCleanIdAndUniversalName(codedUniversalName: string, title: string): Promise<[string, string]> {
        const idAndUnivName = this.getIdAndUniversalNameFromOmpUName(codedUniversalName);

        let cleanUniversalName = idAndUnivName.universalName;
        let cleanID: string = idAndUnivName.id;
        const allWidgetsResponse = await widgetApi.getWidgets();
        if (allWidgetsResponse.status !== 200) {
            console.log("Error building new widget.");
            return ["", ""];
        }
        const allWidgets = allWidgetsResponse.data.data;

        if (cleanID === "") {
            // if someone uses the string "_^_" in their universalName, either accidentally or on purpose.
            const univNamePieces = cleanUniversalName.split("_^_");
            if (univNamePieces.length > 1) {
                for (const w of allWidgets) {
                    for (const un of univNamePieces) {
                        if (w.value.universalName === un && cleanID === "") {
                            // only use first match
                            cleanID = w.id;
                            cleanUniversalName = w.value.universalName;
                            break;
                        }
                    }
                }
            }
        }

        // Save as new (i.e., id=undefined) if that id isn't in the system.
        let found: boolean = false;
        for (const w of allWidgets) {
            if (w.value.universalName === cleanUniversalName) {
                cleanID = w.id;
                found = true;
                break;
            }
            if (w.id === cleanID) {
                cleanUniversalName = w.value.universalName;
                found = true;
                break;
            }
        }
        if (!found) {
            cleanID = "";
        }

        if (cleanUniversalName.length === 0) {
            cleanUniversalName = title;
        }
        return [cleanID, cleanUniversalName];
    }
}

/* example for opening a widget from the store

*/

/* example for opening a dashboard from the store

*/

/* example for opening a stack from the store

*/
