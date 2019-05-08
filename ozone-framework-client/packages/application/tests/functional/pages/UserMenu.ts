import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { AdminToolsDialog } from "./AdminToolsDialog";

export class UserMenu extends PageObject {
    static Selector = `ul[data-element-id="user-menu"]`;
    static AdminMenuItem = `${UserMenu.Selector} a[data-element-id="administration"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, UserMenu.Selector, "User Menu");
    }

    openAdminDialog(): AdminToolsDialog {
        this.clickWhenVisible(UserMenu.AdminMenuItem, "Administration menu item");
        return this.open(AdminToolsDialog).waitUntilVisible();
    }
}
