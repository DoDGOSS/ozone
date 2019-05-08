import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";
import { HomeScreen } from "./HomeScreen";

export class UserAdmin extends PageObject {
    static Selector = `div[data-element-id="user-admin-widget-dialog"]`;

    static navigateTo(browser: NightwatchAPI): UserAdmin {
        return new HomeScreen(browser)
            .openUserMenu()
            .openAdminDialog()
            .openUserAdminWidget();
    }

    constructor(browser: NightwatchAPI) {
        super(browser, UserAdmin.Selector, "User Admin widget");
    }
}
