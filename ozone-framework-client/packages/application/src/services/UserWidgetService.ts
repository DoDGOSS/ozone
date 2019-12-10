import { UserWidgetAPI } from "../api/clients/UserWidgetAPI";
import { WidgetAPI } from "../api/clients/WidgetAPI";
import { DashboardStore } from "../stores/DashboardStore";

export class UserWidgetService {
    // private readonly dashboardStore: DashboardStore;

    constructor(_widgetApi?: WidgetAPI, _userWidgetApi?: UserWidgetAPI, _dashboardStore?: DashboardStore) {
        // this.dashboardStore = _dashboardStore || dashboardStore;
    }

    async getDependencies(): Promise<any> {
        // const dependentWidgets = await widgetApi.getDependentWidgets(userWidget.widget.id);
        // const dependentWidgetIds = dependentWidgets.data.data.map((w: any) => w.id);
        //
        // const userState = this.dashboardStore.userDashboards().value;
        // const userWidgets: UserWidget[] = values(userState.widgets);
        //
        // return userWidgets.filter((w) => dependentWidgetIds.includes(w.widget.id));
        // return <any>[];
        return new Promise(() => undefined);
    }
}

export const userWidgetService = new UserWidgetService();
