import { userWidgetApi, UserWidgetAPI } from "../api/clients/UserWidgetAPI";
import { WidgetAPI, widgetApi } from "../api/clients/WidgetAPI";
import { UserWidget } from "../models/UserWidget";
import { DashboardStore, dashboardStore } from "../stores/DashboardStore";
import { values } from "../utility";
import { ListOf } from "../api/interfaces";

export class UserWidgetService {
    private readonly widgetApi: WidgetAPI;
    private readonly userWidgetApi: UserWidgetAPI;
    private readonly dashboardStore: DashboardStore;

    constructor(_widgetApi?: WidgetAPI, _userWidgetApi?: UserWidgetAPI, _dashboardStore?: DashboardStore) {
        this.widgetApi = _widgetApi || widgetApi;
        this.userWidgetApi = _userWidgetApi || userWidgetApi;
        this.dashboardStore = _dashboardStore || dashboardStore;
    }

    async getDependencies(userWidget: UserWidget): Promise<any> {
        // const dependentWidgets = await widgetApi.getDependentWidgets(userWidget.widget.id);
        // const dependentWidgetIds = dependentWidgets.data.data.map((w: any) => w.id);
        //
        // const userState = this.dashboardStore.userDashboards().value;
        // const userWidgets: UserWidget[] = values(userState.widgets);
        //
        // return userWidgets.filter((w) => dependentWidgetIds.includes(w.widget.id));
        return <any>[];
    }

    async deleteUserWidget(
        userWidget: UserWidget,
        confirmDeleteDependencies: (dependencies: UserWidget[]) => Promise<boolean>,
        confirmDelete: () => Promise<boolean>,
        onGroupDependencies: (dependencies: UserWidget[]) => void
    ): Promise<boolean> {
        const dependencies = await this.getDependencies(userWidget);

        if (dependencies.length === 0) {
            const deleteConfirmed = await confirmDelete();
            if (!deleteConfirmed) return false;

            await this.userWidgetApi.deleteUserWidget(userWidget.id);
            return true;
        }

        const groupDependencies = dependencies.filter((w: any) => w.isGroupWidget);
        if (groupDependencies.length > 0) {
            onGroupDependencies(groupDependencies);
            return false;
        }

        const deleteAllConfirmed = await confirmDeleteDependencies(dependencies);
        if (!deleteAllConfirmed) return false;

        for (const dependency of dependencies) {
            await this.userWidgetApi.deleteUserWidget(dependency.widget.id);
        }
        await this.userWidgetApi.deleteUserWidget(userWidget.widget.id);
        return true;
    }
}

export const userWidgetService = new UserWidgetService();
