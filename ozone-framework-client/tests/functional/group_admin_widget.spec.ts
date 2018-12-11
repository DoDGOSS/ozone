import { NightwatchAPI } from "nightwatch";

import { LoginForm, MainPage, AdminWidgets } from "./selectors";


export default {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an administrator view all groups in admin widget": (browser: NightwatchAPI) => {
        const username = "testAdmin1";
        const password = "password";
        const displayName = "Test Administrator 1";

        browser.url("http://localhost:3000")
            .waitForElementVisible("body", 1000, "[Home Page] is visible");

        browser.click(MainPage.LOGIN_BUTTON)
            .waitForElementVisible(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is visible");

        browser.setValue(LoginForm.USER_NAME_FIELD, username)
            .setValue(LoginForm.PASSWORD_FIELD, password)
            .click(LoginForm.SUBMIT_BUTTON)
            .waitForElementVisible(LoginForm.SUCCESS_CALLOUT, 1000, "[Login Dialog] Success callout is visible");

        browser.assert.containsText(MainPage.USER_MENU_BUTTON,
            displayName, `[User Menu] Button text is equal to "${displayName}"`);

        // Refresh browser temporarily to view the users in the user admin widget
        browser.refresh();

        browser.assert.containsText(AdminWidgets.GROUP_ADMIN_WIDGET_DIALOG,
            'Groups', "[Group Admin Widget] is visible");

        browser.assert.containsText(AdminWidgets.GROUP_ADMIN_WIDGET_DIALOG,
            'OWF Administrators', "[Group Admin Widget] Displays group information");

        browser.closeWindow().end();
    }
};
