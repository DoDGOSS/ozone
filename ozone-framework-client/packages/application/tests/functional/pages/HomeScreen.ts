import { NightwatchAPI } from "../nightwatch";

import { PageElement, PageObject } from "./PageObject";

import { StackDialog } from "./StackDialog";
import { UserMenu } from "./UserMenu";

export class HomeScreen extends PageObject {
    static Selector = `div[data-test-id="home-screen"]`;

    static UserMenuButton = new PageElement(`button[data-element-id="user-menu-button"]`, "User Menu button");
    static StacksButton = new PageElement(`button[data-element-id="stacks-button"]`, "Stacks button");

    constructor(browser: NightwatchAPI) {
        super(browser, HomeScreen.Selector, "Main page");
    }

    openUserMenu(): UserMenu {
        this.clickWhenVisible(HomeScreen.UserMenuButton);
        return this.open(UserMenu).waitUntilVisible();
    }

    openStacksDialog(): StackDialog {
        this.clickWhenVisible(HomeScreen.StacksButton);
        return this.open(StackDialog).waitUntilVisible();
    }
}
