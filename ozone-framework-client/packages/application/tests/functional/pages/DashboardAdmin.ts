import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { HomeScreen } from "./HomeScreen";

export class DashboardAdmin extends PageObject {
    static Selector = `div[data-element-id="dashboard-admin-widget-dialog"]`;

    static navigateTo(browser: NightwatchAPI): DashboardAdmin {
        return new HomeScreen(browser)
            .openUserMenu()
            .openAdminDialog()
            .openDashboardAdminWidget();
    }

    constructor(browser: NightwatchAPI) {
        super(browser, DashboardAdmin.Selector, "Dashboard Admin widget");
    }
}
