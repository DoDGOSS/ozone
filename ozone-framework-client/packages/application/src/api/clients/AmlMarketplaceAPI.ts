import { Gateway, Response } from "../interfaces";
import { OzoneGateway } from "../../services/OzoneGateway";

import { MarketplaceAPI } from "./MarketplaceAPI";

import { Widget } from "../../models/Widget";
import { Dashboard } from "../../models/Dashboard";
import { Stack } from "../../models/Stack";

import { AMLListingDTO } from "../models/AMLStoreDTO";
import { AMLListing } from "../../models/AMLListing";
import { isNil } from "lodash";
import { parseInt10, stringTruncate } from "../../utility/collections";
import { showToast } from "../../components/toaster/Toaster";
import { Intent } from "@blueprintjs/core";
import { dashboardLayoutToDto } from "../../codecs/Dashboard.codec";
import { dashboardApi } from "./DashboardAPI";
import { DashboardDTO } from "../models/DashboardDTO";
import { widgetApi } from "./WidgetAPI";
import { WidgetDTO } from "../models/WidgetDTO";

export class AmlMarketplaceAPI implements MarketplaceAPI {
    private readonly gateway: Gateway;

    constructor(storeUrl: string) {
        this.gateway = new OzoneGateway(storeUrl, true);
    }

    storeListingAsDashboard(stackID: number, dashListing: any): Promise<Dashboard | undefined> {
        return new Promise(() => undefined);
    }

    storeListingAsStack(stackID: number, stackListing: any): Promise<Stack | undefined> {
        return new Promise(() => undefined);
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
            parseInt10(baseWidget.value.widgetVersion) >= parseInt10(listing.versionName)
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
                    smallUrl: listing.icon.url,
                    largeUrl: listing.bannerIcon.url
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
                universalName: listing.uniqueName,
                widgetGuid: listing.widgetGuid,
                url: listing.launchUrl,
                version: listing.versionName,
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
            const existingListing: any | undefined | null = await this.findListingInStore(amlListingToUpload);

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
            const existingListing: any | undefined | null = await this.findListingInStore(amlListingToUpload);

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
            const existingListing: any | undefined | null = await this.findListingInStore(amlListingToUpload);

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
        let result = true;
        result =
            result &&
            !isNil(listing) &&
            !isNil(listing.description) &&
            !isNil(listing.uniqueName) &&
            !isNil(listing.launchUrl) &&
            !isNil(listing.title) &&
            !isNil(listing.versionName) &&
            !isNil(listing.icon) &&
            !isNil(listing.icon.url) &&
            !isNil(listing.bannerIcon) &&
            !isNil(listing.bannerIcon.url);
        return result;
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
            (w: WidgetDTO) => w.value.universalName === listing.uniqueName
        );
        return existingWidgetDTO;
    }

    private async findListingInStore(listing: AMLListing): Promise<any | undefined | null> {
        let response: any;
        try {
            response = await this.gateway.get(`api/listing/`);
        } catch (e) {
            console.log(e);
        }

        const foundListings: any = response.data.filter(
            (lItem: AMLListing) => lItem.unique_name === listing.unique_name
        );

        if (!(response.status >= 200 && response.status < 400) || foundListings.length > 1) {
            return undefined;
        } else if (foundListings.length === 1) {
            return foundListings[0];
        } else {
            return null;
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
        // Take the object as it was given to us from the AML store, and update the values we could possibly have changed
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
        let latestVersion: number = 0; // 0 is the lowest version number possible, if we can't find one, we use 0.
        for (const dashboard of stack.getDashboards(true)) {
            const dashboardVersion = parseInt10(await this.getDashboardEditedDateAsEpochVersion(dashboard));
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
            description: this.getDashboardLayoutAsString(dashboard),
            /* A launch_url is required by the AML store, however, Dashboards do not have direct launch urls, so we fill in with dummy data for now */
            launch_url: "http://localhost/index.html",
            version_name: await this.getDashboardEditedDateAsEpochVersion(dashboard),
            unique_name: dashboard.guid,
            /* Dashboards do not have a 'short' description in Ozone, so we will just truncate whatever is in the existing description.*/
            description_short: dashboard.description ? stringTruncate(dashboard.description, 100) : "",
            is_enabled: false,
            is_deleted: false,
            security_marking: "UNCLASSIFIED",
            is_private: undefined,
            /* As required listings are not implemented in the aml-backend api, we will store the universal names as an array of strings and put
               that array in as a string to the usage_requirements field for an AML listing */
            usage_requirements: this.getDashboardWidgetUniversalNamesAsString(dashboard),
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

    private getDashboardLayoutAsString(dashboard: Dashboard): string {
        const state = dashboard.state().value;
        return JSON.stringify(dashboardLayoutToDto(state));
    }

    private async getDashboardEditedDateAsEpochVersion(dashboard: Dashboard): Promise<string> {
        const response: Response<DashboardDTO> = await dashboardApi.getDashboardByGuid(dashboard.guid);
        let retVal: string = "0";
        if (response && (response.status >= 200 && response.status < 400) && response.data) {
            const dashboardData = response.data;
            retVal = (Date.parse(dashboardData.editedDate) / 1000).toString();
        }
        return retVal;
    }

    private getDashboardWidgetUniversalNamesAsString(dashboard: Dashboard): string {
        let widgets: string = "{'widgets':["; // The start of the json string we are building to hold uuids of dashboards in stacks.
        const initialLength = widgets.length;
        dashboard.getWidgets().forEach((widget) => {
            if (widget && widget.userWidget && widget.userWidget.widget) {
                widgets = widgets + "'" + widget.userWidget.widget.universalName + "',";
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
            version_name: (await this.findLatestVersion(stack)).toString(),
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

    private getOrCreateAMLIcon(): any | undefined {
        return { id: 1 };
        // TODO: Sort out the pushing and using of icons in an AML Store
        // console.log("ATTEMPTING TO FIND OR CREATE AN AML ICON FOR: " + iconUrl);
        // const amlIconToCreate: AMLIcon = new AMLIcon({url:iconUrl,security_marking: "UNCLASSIFIED"})
        // const dataToPost = JSON.stringify(amlIconToCreate);
        // console.log("POSTIMG: " + dataToPost);
        // let response: any;
        // try {
        //     response = this.gateway.get(`api/image/`);
        // } catch (e) {
        //     console.log(e);
        // }
        // console.log(JSON.stringify(response));
        // return undefined;
    }
}
