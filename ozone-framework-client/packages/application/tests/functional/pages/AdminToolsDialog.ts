import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { StackAdmin } from "./StackAdmin";
import { GroupAdmin } from "./GroupAdmin";
import { UserAdmin } from "./UserAdmin";
import { WidgetAdmin } from "./WidgetAdmin";
import { SysConfigAdmin } from "./SysConfigAdmin";

export class AdminToolsDialog extends PageObject {
    static Selector = `div[data-element-id="administration"]`;

    static WidgetAdminItem = `${AdminToolsDialog.Selector} div[data-element-id="Widget Administration"]`;
    static UserAdminItem = `${AdminToolsDialog.Selector} div[data-element-id="User Administration"]`;
    static GroupsAdminItem = `${AdminToolsDialog.Selector} div[data-element-id="Group Administration"]`;
    static StackAdminItem = `${AdminToolsDialog.Selector} div[data-element-id="Stack Administration"]`;
    static SysConfigAdminItem = `${AdminToolsDialog.Selector} div[data-element-id="System Configuration"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, AdminToolsDialog.Selector, "Admin Tools Dialog");
    }

    openWidgetAdminWidget(): WidgetAdmin {
        this.clickWhenVisible(AdminToolsDialog.WidgetAdminItem, "Widget Admin widget tile");
        return this.open(WidgetAdmin).waitUntilVisible();
    }

    openUserAdminWidget(): UserAdmin {
        this.clickWhenVisible(AdminToolsDialog.UserAdminItem, "User Admin widget tile");
        return this.open(UserAdmin).waitUntilVisible();
    }

    openGroupAdminWidget(): GroupAdmin {
        this.clickWhenVisible(AdminToolsDialog.GroupsAdminItem, "Group Admin widget tile");
        return this.open(GroupAdmin).waitUntilVisible();
    }

    openStackAdminWidget(): StackAdmin {
        this.clickWhenVisible(AdminToolsDialog.StackAdminItem, "Stack Admin widget tile");
        return this.open(StackAdmin).waitUntilVisible();
    }

    openSysConfigAdminWidget(): SysConfigAdmin {
        this.clickWhenVisible(AdminToolsDialog.SysConfigAdminItem, "SysConfig Admin widget tile");
        return this.open(SysConfigAdmin).waitUntilVisible();
    }
}
