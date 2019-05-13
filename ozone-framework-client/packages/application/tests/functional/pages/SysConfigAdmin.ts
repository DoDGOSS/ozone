import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { HomeScreen } from "./HomeScreen";

export class SysConfigAdmin extends PageObject {
    static Selector = `div[data-element-id="systemconfig-admin-widget-dialog"]`;

    static navigateTo(browser: NightwatchAPI): SysConfigAdmin {
        return new HomeScreen(browser)
            .openUserMenu()
            .openAdminDialog()
            .openSysConfigAdminWidget();
    }

    constructor(browser: NightwatchAPI) {
        super(browser, SysConfigAdmin.Selector, "SysConfig Admin widget");
    }
}
