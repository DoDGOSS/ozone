import { NightwatchAPI } from "nightwatch";

import { AdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";


export default {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Users in the User Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG, "Test Administrator 1",
            "[User Admin Widget] Displays user information");

        browser.closeWindow().end();
    },

    "As an Administrator, I want to create a new User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

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

        const newUserEmail = "newUserEmail1@email.com";
        const newDisplayName = "Edited User";
        const newUserName = "newUser1";

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG, newUserEmail,
            "[User Admin Widget] Displays user information we wish to edit");

        browser.click(AdminWidget.EDIT_USER_ID);

        browser.pause(1000);

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Username", "[User Admin Create Form] is visible");

        browser.clearValue(AdminWidget.USER_NAME_FIELD)
            .clearValue(AdminWidget.FULL_NAME_FIELD)
            .clearValue(AdminWidget.EMAIL_FIELD);

        browser.setValue(AdminWidget.USER_NAME_FIELD, newUserName)
            .setValue(AdminWidget.FULL_NAME_FIELD, newDisplayName)
            .setValue(AdminWidget.EMAIL_FIELD, newUserEmail);

        browser.click(AdminWidget.SUBMIT_BUTTON);

        browser.pause(1000)
            .waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            newDisplayName, "[User Admin Widget] User successfully edited");

        browser.closeWindow().end();
    },

    "As an Administrator, I want to search for a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

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

        const newUserEmail = "newUserEmail1@email.com";

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG, newUserEmail,
            "[User Admin Widget] Displays user information we wish to delete");

        browser.click(AdminWidget.DELETE_USER_ID);

        browser.waitForElementVisible(AdminWidget.CONFIRM_DELETE_ALERT)
               .click(AdminWidget.CONFIRM_DELETE_BUTTON);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.expect.element(AdminWidget.USER_ADMIN_WIDGET_DIALOG).text.to.not.contain(newUserEmail);

        browser.closeWindow().end();
    }

};
