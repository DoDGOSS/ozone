import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { HomeScreen } from "./HomeScreen";

export class GroupAdmin extends PageObject {
    static Selector = `div[data-element-id="group-admin-widget-dialog"]`;

    static navigateTo(browser: NightwatchAPI): GroupAdmin {
        return new HomeScreen(browser)
            .openUserMenu()
            .openAdminDialog()
            .openGroupAdminWidget();
    }

    constructor(browser: NightwatchAPI) {
        super(browser, GroupAdmin.Selector, "Group Admin widget");
    }
}
