import { NightwatchAPI } from "nightwatch";

import { AdminWidget, GlobalElements } from "./selectors";

import { AdminWidgetType, loggedInAs, openAdminWidget } from "./helpers";


module.exports = {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Users in the User Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG, "Test Administrator 1",
            "[User Admin Widget] Displays user information");

        browser.closeWindow().end();
    },

    "As an Administrator, I want to create a new User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        const newDisplayName = "New User Test";
        const newUserName = "newUser1";
        const newUserEmail = "newUserEmail1@email.com";

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Test Administrator 1",
            "[User Admin Widget] Displays user information");

        browser.click(AdminWidget.USER_ADMIN_CREATE_BUTTON);

        browser.pause(1000);

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Username", "[User Admin Create Form] is visible");

        browser.setValue(AdminWidget.USER_NAME_FIELD, newUserName)
               .setValue(AdminWidget.FULL_NAME_FIELD, newDisplayName)
               .setValue(AdminWidget.EMAIL_FIELD, newUserEmail);

        browser.click(AdminWidget.SUBMIT_BUTTON);

        browser.pause(2000)
               .waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            newDisplayName, "[User Admin Widget] New user successfully created");

        browser.closeWindow().end();
    },

    "As an Administrator, I want to edit a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        const newUserEmail = "newUserEmail1@email.com";
        const newDisplayName = "Edited User";
        const newUserName = "newUser1";

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG, newUserName,
            "[User Admin Widget] Displays user information we wish to edit");

        browser.click(AdminWidget.EDIT_USER_ID);

        browser.pause(1000);

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Username", "[User Admin Create Form] is visible");

        browser.clearValue(AdminWidget.FULL_NAME_FIELD)
            .clearValue(AdminWidget.EMAIL_FIELD);

        browser.setValue(AdminWidget.FULL_NAME_FIELD, newDisplayName)
            .setValue(AdminWidget.EMAIL_FIELD, newUserEmail);

        browser.click(AdminWidget.SUBMIT_BUTTON);

        browser.getAttribute(AdminWidget.SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, 'true', "[Edit User Submit Button] is disabled");
        });

        browser
            .click(AdminWidget.USER_ADMIN_BACK_BUTTON)
            .waitForElementNotPresent(AdminWidget.SUBMIT_BUTTON, 1000, "[Edit User Form] is closed");

        browser.pause(1000)
            .waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            newDisplayName, "[User Admin Widget] User successfully edited");

        browser.closeWindow().end();
    },

    "As an Administrator, I want to search for a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        const adminEmail = "testAdmin1@ozone.test";
        const newUserEmail = "newUserEmail1@email.com";
        const newDisplayName = "Edited User";

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.setValue(AdminWidget.SEARCH_FIELD, newUserEmail);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG, newUserEmail,
            "[User Admin Widget] Displays user information we searched for");

        browser.expect.element(AdminWidget.USER_ADMIN_WIDGET_DIALOG).text.to.not.contain(adminEmail);

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            newDisplayName, "[User Admin Widget] User successfully edited");

        browser.closeWindow().end();
    },

    "As an Administrator, I want to delete a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        const newUserEmail = "newUserEmail1@email.com";

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG, newUserEmail,
            "[User Admin Widget] Displays user information we wish to delete");

        browser.click(AdminWidget.DELETE_USER_ID)
            .waitForElementPresent(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON, 1000, undefined, undefined, "[Confirmation Dialog] is present")
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON, 1000, "[Confirmation Dialog] is not present");

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.expect.element(AdminWidget.USER_ADMIN_WIDGET_DIALOG).text.to.not.contain(newUserEmail);

        browser.closeWindow().end();
    }

};
