import { Gateway, Response } from "../interfaces";
import { OzoneGateway } from "../../services/OzoneGateway";

import { MarketplaceAPI } from "./MarketplaceAPI";

import { Widget } from "../../models/Widget";
import { Dashboard, DashboardLayout } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";

import { AMLListingDTO } from "../models/AMLStoreDTO";
import { AMLListing } from "../../models/AMLListing";
import { isEmpty, isNil } from "lodash";
import { parseInt10, stringTruncate } from "../../utility/collections";
import { showToast } from "../../components/toaster/Toaster";
import { Intent } from "@blueprintjs/core";
import { dashboardLayoutToDto } from "../../codecs/Dashboard.codec";
import { dashboardApi } from "./DashboardAPI";
import { DashboardUpdateRequest } from "../models/DashboardDTO";
import { widgetApi } from "./WidgetAPI";
import { WidgetDTO } from "../models/WidgetDTO";
import { AuthUserDTO } from "../models/AuthUserDTO";
import { dashboardStore } from "../../stores/DashboardStore";
import { StackCreateRequest, StackDTO } from "../models/StackDTO";
import { stackApi } from "./StackAPI";
import { storeImportService } from "../../services/StoreImportService";

export class AmlMarketplaceAPI implements MarketplaceAPI {
    private readonly gateway: Gateway;

    constructor(storeUrl: string) {
        this.gateway = new OzoneGateway(storeUrl, true);
    }

    async storeListingAsDashboard(
        listing: any,
        importingUser: AuthUserDTO,
        stackId: number,
        marketplaceAPI: MarketplaceAPI
    ): Promise<Dashboard | undefined> {
        listing = await this.cleanUpAndVerifyStoreListing(listing);
        const baseDashboard = await this.findDashboardListingInOzone(listing);
        let dashWidgetUNs: Array<string> = [];

        if (listing.usage_requirements) {
            const widgetUNJson = JSON.parse(listing.usage_requirements);
            dashWidgetUNs = widgetUNJson.widgets;
            for (const widgetUniversalName of dashWidgetUNs) {
                if (!isNil(widgetUniversalName)) {
                    const widgetListing = await this.findListingInStore(widgetUniversalName);
                    if (widgetListing && marketplaceAPI) {
                        await storeImportService.importWidget(importingUser, marketplaceAPI, widgetListing);
                    } else {
                        console.log("ERROR: We could not find the widget in the store that the dashboard requires.");
                    }
                }
            }
        }

        if (baseDashboard && (await this.getDashboardVersion(baseDashboard)) >= parseInt10(listing.version_name)) {
            // Return undefined, as the dashboard is already up to date and should not be  created, updated, or imported.
            return undefined;
        }

        const listingDashLayout: DashboardLayout = JSON.parse(
            this.swapUniversalNameForUserWidgetId(listing.description, dashWidgetUNs)
        );

        const dashboard = new Dashboard({
            // Use the listing values we care about for creating/updating a dashboard
            description: listing.description_short,
            panels: listing.description.panels,
            tree: listing.description.tree,
            backgroundWidgets: listing.description.backgroundWidgets,
            name: listing.title,

            // Since it is a listing from a store, we know that it has been published
            isPublishedToStore: true,

            // We determined this value above
            stackId: stackId,

            // If we found a baseDashboard, use those values, generate defaults for a new Dashboard.
            user: baseDashboard ? baseDashboard.state().value.user : importingUser,
            guid: baseDashboard ? baseDashboard.guid : listing.unique_name,
            isAlteredByAdmin: baseDashboard ? baseDashboard.state().value.isAlteredByAdmin : false,
            isDefault: baseDashboard ? baseDashboard.state().value.isDefault : false,
            isGroupDashboard: baseDashboard ? baseDashboard.state().value.isGroupDashboard : false,
            isLocked: baseDashboard ? baseDashboard.state().value.isLocked : false,
            isMarkedForDeletion: false,
            // TODO: Might need a function here to intelligently positiong the Dashboard to the next available position
            position: baseDashboard ? baseDashboard.state().value.position : 1
        });

        let successfulDashboardUpdate: boolean = false;

        if (baseDashboard) {
            // Update existing dashboard
            const dashboardUpdate: DashboardUpdateRequest = {
                id: baseDashboard.state().value.id!,
                guid: baseDashboard.guid,
                name: baseDashboard.name,
                description: baseDashboard.description,
                layoutConfig: JSON.stringify(listingDashLayout)
            };
            const dashUpdateResponse = await dashboardApi.updateDashboard(dashboardUpdate);
            successfulDashboardUpdate = dashUpdateResponse.status >= 200 && dashUpdateResponse.status < 400;
            dashboardStore.fetchUserDashboards(baseDashboard.guid);
        } else {
            /* Create new Dashboard with specific GUID.  Due to the complicated nature of panel state handling, 
               We have to create the dashboard with the passed in layout which will create the correct structure
               for the dash, but will not contain the proper widgets. */
            const createdDash = await dashboardStore.createSpecificDashboardFromStore(
                dashboard,
                listingDashLayout,
                stackId
            );

            /* Once the dashboard has been created, then we can update the dashboard, pushing our exact layout 
               in and it will be honored */
            const dashboardUpdate: DashboardUpdateRequest = {
                id: createdDash.id,
                guid: createdDash.guid,
                name: createdDash.name,
                description: createdDash.description,
                layoutConfig: JSON.stringify(listingDashLayout)
            };
            const dashUpdateResponse = await dashboardApi.updateDashboard(dashboardUpdate);
            successfulDashboardUpdate = dashUpdateResponse.status >= 200 && dashUpdateResponse.status < 400;
            dashboardStore.fetchUserDashboards(createdDash.guid);
        }

        if (successfulDashboardUpdate) {
            showToast({
                message: "Dashboard '" + listing.title + "' created or updated successfully.",
                intent: Intent.SUCCESS
            });
        } else {
            showToast({
                message:
                    "Dashboard '" + listing.title + "' could not be created or updated.  Contact your Administrator.",
                intent: Intent.DANGER
            });
        }

        return dashboard;
    }

    async storeListingAsStack(
        listing: any,
        importingUser: AuthUserDTO,
        marketplaceAPI: MarketplaceAPI
    ): Promise<Stack | undefined> {
        const findStackListingResponse = await this.findStackListingInOzone(listing);
        let stackId: number;
        let baseStack;
        if (!findStackListingResponse) {
            // If we do not already have the stack, create a basic stack to then fill in with the info
            const stackCreateInfo: StackCreateRequest = {
                name: listing.title,
                approved: true,
                stackContext: listing.unique_name
            };
            const response = await stackApi.createStack(stackCreateInfo);
            if (response.status > 299 || response.status < 200 || !response.data) {
                showToast({
                    message: "Error: Unable to create new Stack '" + listing.title + "' Contact Your Administrator.",
                    intent: Intent.DANGER
                });
                return undefined;
            }

            baseStack = undefined;
            stackId = response.data.id;
            // Since we created a stack, a default dashboard is necessarily created.  We should delete that and any other dashboards this stack might have.
            const dashesToDelete = (await dashboardApi.getDashboards()).data.data.filter(
                (d) => d.stack && d.stack.id === stackId
            );
            for (const dashToDel of dashesToDelete) {
                if (dashToDel) {
                    dashboardApi.deleteDashboard(dashToDel);
                }
            }
        } else if (typeof findStackListingResponse === "number") {
            // We have the stack, but there are no dashboards in the Stack
            baseStack = undefined;
            stackId = findStackListingResponse;
        } else {
            baseStack = findStackListingResponse;
            stackId = baseStack.id;
        }

        const stackDashboards: Dictionary<Dashboard> = {};
        if (listing.usage_requirements) {
            const dashboardGuidJson = JSON.parse(listing.usage_requirements);
            const guidArray: Array<string> = dashboardGuidJson.dashboards;
            for (const dashGuid of guidArray) {
                const dashListing = await this.findListingInStore(dashGuid);
                const newDashboard = await this.storeListingAsDashboard(
                    dashListing,
                    importingUser,
                    stackId,
                    marketplaceAPI
                );
                if (newDashboard) {
                    stackDashboards[newDashboard.guid] = newDashboard;
                }
            }
        }

        if (baseStack && (await this.findLatestVersion(baseStack)) >= parseInt10(listing.version_name)) {
            // Return undefined, as the stack is already up to date and should not be created, updated, or imported.
            return undefined;
        }

        return new Stack({
            // Use the listing values we care about for creating/updating a stack
            description: listing.description,
            name: listing.title,

            // Since it is a listing from a store, we know that it has been approved
            approved: true,
            imageUrl: listing.small_icon ? listing.small_icon.url : baseStack ? baseStack.imageUrl : undefined,
            dashboards: stackDashboards,
            descriptorUrl: baseStack && baseStack.descriptorUrl ? baseStack.descriptorUrl : undefined,
            id: stackId, // TODO: Get or create the next id if we don't already have a stack like this.
            owner: baseStack && baseStack.owner ? baseStack.owner : importingUser,
            stackContext: baseStack ? baseStack.stackContext : listing.unique_name
        });
    }

    async cleanUpAndVerifyStoreListing(listing: any): Promise<any | undefined> {
        const storeHasNecessaryFields = this.storeListingHasNecessaryFields(listing);
        let listingToReturn: any;
        if (storeHasNecessaryFields) {
            listingToReturn = listing;
        } else if (!storeHasNecessaryFields && listing.id) {
            const listingFromId = await this.getStoreListingById(listing.id);
            if (this.storeListingHasNecessaryFields(listingFromId)) {
                listingToReturn = listingFromId;
            }
        }
        return listingToReturn;
    }

    listingAsSimpleNewStack(listing: any): any | undefined {
        return undefined;
    }

    getAllUniqueWidgetsFromStackListing(listing: AMLListingDTO): Promise<Widget[]> {
        return new Promise(() => []);
    }

    async storeListingAsWidget(listing: any): Promise<Widget | undefined> {
        const baseWidget: WidgetDTO | undefined = await this.findListingInOzone(listing);
        if (
            baseWidget &&
            baseWidget.value.widgetVersion &&
            parseInt10(baseWidget.value.widgetVersion) >= parseInt10(listing.version_name)
        ) {
            return undefined;
        } else {
            return new Widget({
                // TODO: Once the backend rewrite is completed, the description field should no longer be limited to 255 chars
                description: stringTruncate(listing.description, 255),
                descriptorUrl:
                    baseWidget && baseWidget.value.descriptorUrl ? baseWidget.value.descriptorUrl : undefined,
                height: baseWidget ? baseWidget.value.height : 200,
                id: baseWidget ? baseWidget.id : undefined,
                images: {
                    smallUrl: listing.small_icon.url,
                    largeUrl: listing.large_icon.url
                },
                intents: {
                    send: baseWidget ? baseWidget.value.intents.send : [],
                    receive: baseWidget ? baseWidget.value.intents.receive : []
                },
                isBackground: baseWidget ? baseWidget.value.background : false,
                isDefinitionVisible: baseWidget ? baseWidget.value.definitionVisible : true,
                isMaximized: baseWidget ? baseWidget.value.maximized : false,
                isMinimized: baseWidget ? baseWidget.value.minimized : false,
                isMobileReady: baseWidget ? baseWidget.value.mobileReady : false,
                isSingleton: baseWidget ? baseWidget.value.singleton : false,
                isVisible: baseWidget ? baseWidget.value.visible : true,
                title: listing.title,
                types: baseWidget ? baseWidget.value.widgetTypes : [],
                universalName: listing.unique_name,
                widgetGuid: baseWidget ? baseWidget.value.widgetGuid : "",
                url: listing.launch_url,
                version: listing.version_name,
                width: baseWidget ? baseWidget.value.width : 200,
                x: baseWidget ? baseWidget.value.x : 0,
                y: baseWidget ? baseWidget.value.y : 0
            });
        }
    }

    getListingType(listing: any): string | undefined {
        if (listing && listing.listingType) {
            return listing.listingType;
        } else {
            return undefined;
        }
    }

    async uploadWidget(widget: Widget): Promise<{ intent: Intent; message: string }> {
        const amlListingToUpload: AMLListing | undefined = this.getListingFromWidget(widget);
        if (amlListingToUpload) {
            const existingListing: any | undefined | null = await this.findListingInStore(
                amlListingToUpload.unique_name
            );

            if (existingListing === null) {
                return await this.uploadNewListing(amlListingToUpload);
            } else if (existingListing === undefined) {
                return {
                    intent: Intent.DANGER,
                    message: "ERROR in listing response from the AML Store for Widget '" + widget.title + "'."
                };
            } else {
                if (parseInt10(existingListing.version_name) >= parseInt10(amlListingToUpload.version_name)) {
                    return {
                        intent: Intent.PRIMARY,
                        message: "Widget '" + widget.title + "' is already up to date in the store."
                    };
                } else {
                    return await this.updateExistingListing(
                        this.cleanUpListingToUpload(amlListingToUpload, existingListing)
                    );
                }
            }
        } else {
            return {
                intent: Intent.DANGER,
                message: "Could not convert Widget '" + widget.title + "' to AML Listing Successfully!"
            };
        }
    }

    async uploadDashboard(dashboard: Dashboard): Promise<{ intent: Intent; message: string }> {
        await this.uploadDashboardWidgets(dashboard);

        const amlListingToUpload: AMLListing | undefined = await this.getListingFromDashboard(dashboard);
        if (amlListingToUpload) {
            const existingListing: any | undefined | null = await this.findListingInStore(
                amlListingToUpload.unique_name
            );

            if (existingListing === null) {
                return await this.uploadNewListing(amlListingToUpload);
            } else if (existingListing === undefined) {
                return {
                    intent: Intent.DANGER,
                    message: "ERROR in listing response from the AML Store for Dashboard '" + dashboard.name + "'."
                };
            } else {
                if (parseInt10(existingListing.version_name) >= parseInt10(amlListingToUpload.version_name)) {
                    return {
                        intent: Intent.PRIMARY,
                        message: "Dashboard '" + dashboard.name + "' is already up to date in the store."
                    };
                } else {
                    return await this.updateExistingListing(
                        await this.cleanUpListingToUpload(amlListingToUpload, existingListing)
                    );
                }
            }
        } else {
            return {
                intent: Intent.DANGER,
                message: "Could not convert Dashboard '" + dashboard.name + "' to AML Listing Successfully!"
            };
        }
    }

    async uploadStack(stack: Stack): Promise<{ intent: Intent; message: string }> {
        await this.uploadStackDashboards(stack);

        const amlListingToUpload: AMLListing | undefined = await this.getListingFromStack(stack);

        if (amlListingToUpload) {
            const existingListing: any | undefined | null = await this.findListingInStore(
                amlListingToUpload.unique_name
            );

            if (existingListing === null) {
                return this.uploadNewListing(amlListingToUpload);
            } else if (existingListing === undefined) {
                return {
                    intent: Intent.DANGER,
                    message: "ERROR in listing response from the AML Store for Stack '" + stack.name + "'."
                };
            } else {
                if (parseInt10(existingListing.version_name) >= parseInt10(amlListingToUpload.version_name)) {
                    return {
                        intent: Intent.PRIMARY,
                        message: "Stack '" + stack.name + "' is already up to date in the store."
                    };
                } else {
                    return this.updateExistingListing(
                        await this.cleanUpListingToUpload(amlListingToUpload, existingListing)
                    );
                }
            }
        } else {
            return {
                intent: Intent.DANGER,
                message: "Could not convert Stack '" + Stack.name + "'to AML Listing Successfully!"
            };
        }
    }

    storeListingHasNecessaryFields(listing: any): boolean {
        /* Depending on what endpoint was queried from the AML store, we can get different results.  
           One endpoint returns the listing json using camelCase, while another returns more information, and 
           another enpoint returns the listing json with more detail, and uses snake_case.  This set of checks
           is to verify that we are bringing in the more detailed version, and ensures throughout all of our
           AML code we are going to be using the snake_case variables for a listing for consistancy as well. */
        let result = true;
        result =
            result &&
            !isNil(listing) &&
            !isNil(listing.description) &&
            !isNil(listing.unique_name) &&
            !isNil(listing.launch_url) &&
            !isNil(listing.title) &&
            !isNil(listing.version_name) &&
            !isNil(listing.small_icon) &&
            !isNil(listing.small_icon.url) &&
            !isNil(listing.large_icon) &&
            !isNil(listing.large_icon.url);
        return result;
    }

    private async findDashboardListingInOzone(listing: any): Promise<Dashboard | undefined> {
        const response = await dashboardApi.getDashboardByGuidAsAdmin(listing.unique_name);

        if (response.status === 200 && response.data && !isEmpty(response.data.data)) {
            const foundDashboard: Dashboard = response.data.data[0];

            /* TODO: From here, we actually have the real Dashboard from the db, but that dashboard is the base dashboard everyone copies off of, 
               not this particular user's dashboard to be displayed.  We *should* probably have some easier method of handling this.*/

            await dashboardStore.fetchUserDashboards();
            const userDashboardDictionary = dashboardStore.userDashboards().value.dashboards;
            const userDashboards = [];
            for (const guid in userDashboardDictionary) {
                if (guid) {
                    userDashboards.push(userDashboardDictionary[guid]);
                }
            }
            // The workaround for the time being is to just find the matching users (admin users) version of the dashboard based on the name.  We can do better.
            const foundUserDashboard = userDashboards.find((d) => d.name === foundDashboard.name);
            return foundUserDashboard;
        }
        return undefined;
    }

    private async findStackListingInOzone(listing: any): Promise<Stack | number | undefined> {
        const response = await stackApi.getStacksAsAdmin();
        if (response.status === 200 && response.data && response.data.data) {
            const foundStack = response.data.data.find((stack: StackDTO) => stack.stackContext === listing.unique_name);

            if (foundStack) {
                await dashboardStore.fetchUserDashboards();
                const allDashboards = dashboardStore.userDashboards().value;
                const stack = allDashboards.stacks[foundStack.id];
                return stack ? stack : foundStack.id;
            }
        }
        return undefined;
    }

    private async uploadStackDashboards(stack: Stack) {
        for (const dashboard of stack.getDashboards(true)) {
            if (dashboard) {
                const response = await this.uploadDashboard(dashboard);
                showToast({ message: response.message, intent: response.intent });
            }
        }
    }

    private async uploadDashboardWidgets(dashboard: Dashboard) {
        for (const widget of dashboard.getWidgets()) {
            if (widget.userWidget.widget) {
                const response = await this.uploadWidget(widget.userWidget.widget);
                showToast({ message: response.message, intent: response.intent });
            }
        }
    }

    private async findListingInOzone(listing: any): Promise<WidgetDTO | undefined> {
        const allWidgets: WidgetDTO[] = (await widgetApi.getWidgets()).data.data;
        const existingWidgetDTO: WidgetDTO | undefined = allWidgets.find(
            (w: WidgetDTO) => w.value.universalName === listing.unique_name
        );
        return existingWidgetDTO;
    }

    private async findListingInStore(uniqueName: string): Promise<any | undefined | null> {
        let response: any;
        try {
            response = await this.gateway.get(`api/listing/`);
        } catch (e) {
            console.log(e);
        }

        const foundListings: any = response.data.filter((lItem: AMLListing) => lItem.unique_name === uniqueName);

        if (!(response.status >= 200 && response.status < 400) || foundListings.length > 1) {
            return undefined;
        } else if (foundListings.length === 1) {
            return foundListings[0];
        } else {
            return null;
        }
    }

    private async getStoreListingById(id: number): Promise<any> {
        let response: any;
        try {
            response = await this.gateway.get(`api/listing/` + id + `/`);
        } catch (e) {
            console.log(e);
        }

        if (response.status !== 200) {
            return undefined;
        } else {
            return response.data;
        }
    }

    private async uploadNewListing(listing: AMLListing): Promise<{ intent: Intent; message: string }> {
        const requestData = JSON.stringify(listing);
        let response: any;
        try {
            response = await this.gateway.post(`api/listing/`, requestData, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            console.log(e);
        }

        if (response) {
            const responseSuccess: boolean = response.status === 201 || response.status === 200;
            if (responseSuccess) {
                return { intent: Intent.SUCCESS, message: "Listing " + listing.title + " Created successfully!" };
            } else {
                return {
                    intent: Intent.DANGER,
                    message: response.statusText
                        ? response.statusText + "HTTP STATUS: " + response.status
                        : response.message + "HTTP STATUS: " + response.status
                };
            }
        } else {
            return {
                intent: Intent.DANGER,
                message:
                    "ERROR: No Response from Store Uploading '" + listing.title + "'. Check with your Administrator."
            };
        }
    }

    private async updateExistingListing(listing: any): Promise<{ intent: Intent; message: string }> {
        const requestData = JSON.stringify(listing);

        let response: any;
        try {
            response = await this.gateway.put(`api/listing/` + listing.id + `/`, requestData, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            console.log(e);
        }

        if (response) {
            const responseSuccess: boolean = response.status === 201 || response.status === 200;
            if (responseSuccess) {
                return { intent: Intent.SUCCESS, message: "Listing " + listing.title + " Updated successfully!" };
            } else {
                return {
                    intent: Intent.DANGER,
                    message: response.statusText
                        ? response.statusText + "HTTP STATUS: " + response.status
                        : response.message + "HTTP STATUS: " + response.status
                };
            }
        } else {
            return {
                intent: Intent.DANGER,
                message:
                    "ERROR: No Response from Store Uploading '" + listing.title + "'. Check with your Administrator."
            };
        }
    }

    private cleanUpListingToUpload(newListing: AMLListing, existingListing: any): any {
        /* Take the object as it was given to us from the AML store, and update the values we could possibly have changed
           We do this so that we do not simply overwrite the entire listing in the AML store, possibly erasing values that 
           Ozone doesn't care about but AML does, such as tags and categories */
        const updatedListing: any = existingListing;
        updatedListing.title = newListing.title;
        updatedListing.description = newListing.description;
        updatedListing.description_short = newListing.description_short;
        updatedListing.launch_url = newListing.launch_url;
        updatedListing.version_name = newListing.version_name;
        updatedListing.usage_requirements = newListing.usage_requirements;
        updatedListing.system_requirements = newListing.system_requirements;
        return updatedListing;
    }

    private async findLatestVersion(stack: Stack): Promise<number> {
        /* TODO: Refactor here! 
            In our backend, we have 'Version' for Stack, but it does not exist in the frontend models
            Once those exist, and the date is coming in, we no longer need to perform this complicated logic, we can 
            compare directly wherever this is being called. */
        let latestVersion: number = 0; // 0 is the lowest version number possible, if we can't find one, we use 0.
        for (const dashboard of stack.getDashboards(true)) {
            const dashboardVersion = await this.getDashboardVersion(dashboard);
            latestVersion = dashboardVersion > latestVersion ? dashboardVersion : latestVersion;
            for (const widget of dashboard.getWidgets()) {
                const widgetVersion = widget.userWidget.widget.version
                    ? parseInt10(widget.userWidget.widget.version)
                    : 0;
                latestVersion = widgetVersion > latestVersion ? widgetVersion : latestVersion;
            }
        }
        return latestVersion;
    }

    private async getListingFromDashboard(dashboard: Dashboard): Promise<AMLListing | undefined> {
        const dashWidgetList = this.getDashboardWidgetUniversalNamesAsString(dashboard);
        const listing: AMLListing = new AMLListing({
            id: undefined,
            small_icon: this.getOrCreateAMLIcon(),
            large_icon: this.getOrCreateAMLIcon(),
            banner_icon: undefined,
            large_banner_icon: undefined,
            listing_type: {
                title: "Dashboard"
            },
            title: dashboard.name,
            /* The description field is the largest available field in the Listing so we will leverage that to hold the dashboard layout information */
            description: this.getDashboardLayoutAsString(dashboard, dashWidgetList),
            /* A launch_url is required by the AML store, however, Dashboards do not have direct launch urls, so we fill in with dummy data for now */
            launch_url: "http://localhost/index.html",
            version_name: await this.getDashboardVersion(dashboard),
            unique_name: dashboard.guid,
            /* Dashboards do not have a 'short' description in Ozone, so we will just truncate whatever is in the existing description.*/
            description_short: dashboard.description ? stringTruncate(dashboard.description, 100) : "",
            is_enabled: false,
            is_deleted: false,
            security_marking: "UNCLASSIFIED",
            is_private: undefined,
            /* As required listings are not implemented in the aml-backend api, we will store the universal names as an array of strings and put
               that array in as a string to the usage_requirements field for an AML listing */
            usage_requirements: dashWidgetList,
            system_requirements: "None",
            /* required_listings API is not yet implemented in aml-backend, so we are unable to make use of this yet... */
            required_listings: undefined
        });

        if (listing) {
            return listing;
        } else {
            return undefined;
        }
    }

    private getStackDashboardUuidsAsString(stack: Stack): string {
        let dashboards: string = '{"dashboards":['; // The start of the json string we are building to hold uuids of dashboards in stacks.
        const initialLength = dashboards.length;
        stack.getDashboards(true).forEach((dashboard) => {
            if (dashboard && dashboard.guid) {
                dashboards = dashboards + '"' + dashboard.guid + '",';
            }
        });
        if (dashboards.length > initialLength) {
            // We have some uuids in there, need to strip off the trailing comma
            dashboards = dashboards.substr(0, dashboards.length - 1);
        }
        dashboards = dashboards + "]}";
        return dashboards;
    }

    private getDashboardLayoutAsString(dashboard: Dashboard, widgetList: string): string {
        const state = dashboard.state().value;
        const dashLayoutAsString = JSON.stringify(dashboardLayoutToDto(state));
        return this.swapUserWidgetIdForUniversalName(dashLayoutAsString, widgetList);
    }

    private async getDashboardVersion(dashboard: Dashboard): Promise<number> {
        /* TODO: Possibly make improvements here.  I have made use of the new builtin versioning for dashboards, however, the version
           field does not exist in any of the front end models at the moment. */
        const response: Response<any> = await dashboardApi.getDashboardByGuidAsAdmin(dashboard.guid);
        let retVal: number = 0;
        if (response && (response.status >= 200 && response.status < 400) && response.data) {
            const dashboardData = response.data.data[0];
            retVal = dashboardData.version;
        }
        return retVal;
    }

    private getDashboardWidgetUniversalNamesAsString(dashboard: Dashboard): string {
        let widgets: string = '{"widgets":['; // The start of the json string we are building to hold uuids of dashboards in stacks.
        const initialLength = widgets.length;
        dashboard.getWidgets().forEach((widget) => {
            if (widget && widget.userWidget && widget.userWidget.widget) {
                widgets = widgets + '"' + widget.userWidget.widget.universalName + '",';
            }
        });
        if (widgets.length > initialLength) {
            // We have some uuids in there, need to strip off the trailing comma
            widgets = widgets.substr(0, widgets.length - 1);
        }
        widgets = widgets + "]}";
        return widgets;
    }

    private async getListingFromStack(stack: Stack): Promise<AMLListing | undefined> {
        const listing: AMLListing = new AMLListing({
            id: undefined,
            small_icon: this.getOrCreateAMLIcon(),
            large_icon: this.getOrCreateAMLIcon(),
            banner_icon: undefined,
            large_banner_icon: undefined,
            listing_type: {
                title: "Web Application"
            },
            title: stack.name,
            description: stack.description ? stack.description : "",
            /* A launch_url is required by the AML store, however, Stacks do not have direct launch urls, so we fill in with dummy data for now */
            launch_url: "http://localhost/index.html",
            /* Stacks do not have versions per se, so we calculated the latest version of any component (dashboard or widget) contained in the Stack */
            version_name: await this.findLatestVersion(stack),
            unique_name: stack.stackContext,
            /* Stacks do not have a 'short' description in Ozone, so we will just truncate whatever is in the existing description.*/
            description_short: stack.description ? stringTruncate(stack.description, 100) : "",
            is_enabled: true,
            is_deleted: false,
            security_marking: "UNCLASSIFIED",
            is_private: undefined,
            /* As required listings are not implemented in the aml-backend api, we will store the dashboard guids as an array of strings and put
               that array in as a string to the usage_requirements field for an AML listing */
            usage_requirements: this.getStackDashboardUuidsAsString(stack),
            system_requirements: "None",
            required_listings: undefined
        });

        if (listing) {
            return listing;
        } else {
            return undefined;
        }
    }

    private getListingFromWidget(widget: Widget): AMLListing | undefined {
        const listing: AMLListing = new AMLListing({
            id: undefined,
            small_icon: this.getOrCreateAMLIcon(),
            large_icon: this.getOrCreateAMLIcon(),
            banner_icon: undefined,
            large_banner_icon: undefined,
            listing_type: {
                title: "Widget"
            },
            title: widget.title,
            description: widget.description ? widget.description : "",
            launch_url: widget.url,
            version_name: widget.version ? widget.version : "",
            unique_name: widget.universalName,
            /* Widgets do not have a 'short' description in Ozone, so we will just truncate whatever is in the existing description.*/
            description_short: widget.description ? stringTruncate(widget.description, 100) : "",
            is_enabled: true,
            is_deleted: false,
            // TODO: Handle different classifications depending on Ozone implmentation.
            security_marking: "UNCLASSIFIED",
            is_private: undefined,
            usage_requirements: "None",
            system_requirements: "None",
            required_listings: undefined
        });

        if (listing) {
            return listing;
        } else {
            return undefined;
        }
    }

    private swapUniversalNameForUserWidgetId(dashLayout: string, dashWidgetUNs: string[]): string {
        for (const widgetUN of dashWidgetUNs) {
            const userWidget = dashboardStore.findUserWidgetByUniversalName(widgetUN);
            if (userWidget) {
                const userWidgetIdRegEx = new RegExp('"userWidgetId":' + widgetUN, "g");
                const userWidgetIdReplace = '"userWidgetId":' + userWidget.id.toString();
                dashLayout = dashLayout.replace(userWidgetIdRegEx, userWidgetIdReplace);
            }
        }
        return dashLayout;
    }

    private swapUserWidgetIdForUniversalName(dashLayout: string, dashWidgetList: string): string {
        const widgetUNJson = JSON.parse(dashWidgetList);
        const dashWidgetUNs = widgetUNJson.widgets;
        for (const widgetUN of dashWidgetUNs) {
            const userWidget = dashboardStore.findUserWidgetByUniversalName(widgetUN);
            if (userWidget) {
                const userWidgetIdRegEx = new RegExp('"userWidgetId":' + userWidget.id.toString(), "g");
                const userWidgetIdReplace = '"userWidgetId":' + widgetUN;
                dashLayout = dashLayout.replace(userWidgetIdRegEx, userWidgetIdReplace);
            }
        }
        return dashLayout;
    }

    private getOrCreateAMLIcon(): any | undefined {
        return { id: 1 };
        // TODO: Sort out the pushing and using of icons in an AML Store
        // const amlIconToCreate: AMLIcon = new AMLIcon({url:iconUrl,security_marking: "UNCLASSIFIED"})
        // const dataToPost = JSON.stringify(amlIconToCreate);
        // let response: any;
        // try {
        //     response = this.gateway.get(`api/image/`);
        // } catch (e) {
        //     console.log(e);
        // }
        // return undefined;
    }
}
