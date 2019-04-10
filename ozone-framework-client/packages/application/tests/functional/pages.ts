import { NightwatchAPI } from "./nightwatch";

import { PageObject } from "./PageObject";
import { WidgetAdmin } from "./widget-admin-pages";

export class MainPage extends PageObject {
    static UserMenuButton = `button[data-element-id="user-menu-button"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, "#root", "Main Page");
    }

    openUserMenu(): UserMenu {
        this.browser.click(MainPage.UserMenuButton);
        return new UserMenu(this.browser).waitUntilVisible();
    }
}

export class UserMenu extends PageObject {
    static Selector = `ul[data-element-id="user-menu"]`;
    static AdminMenuItem = `${UserMenu.Selector} a[data-element-id="administration"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, UserMenu.Selector, "User Menu");
    }

    openAdminDialog(): AdminToolsDialog {
        this.browser.click(UserMenu.AdminMenuItem);
        return new AdminToolsDialog(this.browser).waitUntilVisible();
    }
}

export class AdminToolsDialog extends PageObject {
    static Selector = `div[data-element-id="administration"]`;
    static WidgetAdminItem = `${AdminToolsDialog.Selector} div[data-element-id='Widget Administration']`;

    constructor(browser: NightwatchAPI) {
        super(browser, AdminToolsDialog.Selector, "Admin Tools Dialog");
    }

    openWidgetAdminWidget(): WidgetAdmin {
        this.browser.click(AdminToolsDialog.WidgetAdminItem);
        return new WidgetAdmin(this.browser).waitUntilVisible();
    }
}
