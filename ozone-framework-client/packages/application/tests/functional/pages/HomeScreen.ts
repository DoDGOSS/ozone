import { NightwatchAPI } from "../nightwatch";

import { PageElement, PageObject } from "./PageObject";

import { DashboardDialog } from "./DashboardDialog";
import { UserMenu } from "./UserMenu";

export class HomeScreen extends PageObject {
    static Selector = `div[data-test-id="home-screen"]`;

    static UserMenuButton = new PageElement(`button[data-element-id="user-menu-button"]`, "User Menu button");
    static DashboardsButton = new PageElement(`button[data-element-id="dashboards-button"]`, "Dashboards button");

    constructor(browser: NightwatchAPI) {
        super(browser, HomeScreen.Selector, "Main page");
    }

    openUserMenu(): UserMenu {
        this.clickWhenVisible(HomeScreen.UserMenuButton);
        return this.open(UserMenu).waitUntilVisible();
    }

    openDashboardDialog(): DashboardDialog {
        this.clickWhenVisible(HomeScreen.DashboardsButton);
        return this.open(DashboardDialog).waitUntilVisible();
    }
}
