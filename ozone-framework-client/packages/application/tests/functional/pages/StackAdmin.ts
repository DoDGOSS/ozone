import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { HomeScreen } from "./HomeScreen";

export class StackAdmin extends PageObject {
    static Selector = `div[data-element-id="stack-admin-widget-dialog"]`;

    static navigateTo(browser: NightwatchAPI): StackAdmin {
        return new HomeScreen(browser)
            .openUserMenu()
            .openAdminDialog()
            .openStackAdminWidget();
    }

    constructor(browser: NightwatchAPI) {
        super(browser, StackAdmin.Selector, "Stack Admin widget");
    }
}
