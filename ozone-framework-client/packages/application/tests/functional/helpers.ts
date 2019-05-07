import { AdminWidgetsDialog, MainPage, WidgetAdminWidget } from "./selectors";
import { NightwatchAPI } from "./nightwatch";
import { Application } from "./login-pages";

export function loggedInAs(browser: NightwatchAPI, username: string, password: string, displayName: string) {
    new Application(browser)
        .waitForConsentPage()
        .clickAcceptButton()
        .enterUsername(username)
        .enterPassword(password)
        .clickSubmitButton();
}

export enum AdminWidgetType {
    WIDGETS,
    USERS,
    GROUPS,
    DASHBOARDS
}

export function openAdminWidget(browser: NightwatchAPI, type: AdminWidgetType) {
    browser
        .click(MainPage.USER_MENU_BUTTON)
        .waitForElementVisible(MainPage.ADMINISTRATION_BUTTON, 2000, "[Administration Button] is visible");

    browser
        .click(MainPage.ADMINISTRATION_BUTTON)
        .waitForElementVisible(MainPage.ADMINISTRATION_MENU, 2000, "[Administration Menu] is visible");

    switch (type) {
        case AdminWidgetType.WIDGETS:
            browser
                .click(AdminWidgetsDialog.WIDGETS_MENU_ADMIN_BUTTON)
                .waitForElementVisible(
                    WidgetAdminWidget.Main.DIALOG,
                    2000,
                    "[Widget Administration Widget] is visible"
                );
            break;

        case AdminWidgetType.USERS:
            browser
                .click(AdminWidgetsDialog.USER_MENU_ADMIN_BUTTON)
                .waitForElementVisible(
                    MainPage.USER_ADMINISTRATION_WIDGET,
                    2000,
                    "[User Administration Widget] is visible"
                );
            break;

        case AdminWidgetType.GROUPS:
            browser
                .click(AdminWidgetsDialog.GROUPS_ADMIN_BUTTON)
                .waitForElementVisible(MainPage.GROUPS_ADMIN_WIDGET, 2000, "[Groups Administration Widget] is visible");
            break;

        case AdminWidgetType.DASHBOARDS:
            browser
                .click(AdminWidgetsDialog.DASHBOARDS_MENU_ADMIN_BUTTON)
                .waitForElementVisible(
                    MainPage.DASHBOARD_ADMIN_WIDGET,
                    2000,
                    "[Dashboards Administration Widget] is visible"
                );
            break;
    }
}
