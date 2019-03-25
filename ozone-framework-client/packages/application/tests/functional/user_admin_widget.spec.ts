import { NightwatchAPI } from "nightwatch";

import { AdminWidget, GlobalElements, UserAdminWidget } from "./selectors";

import { AdminWidgetType, loggedInAs, openAdminWidget } from "./helpers";
import { NightwatchCallbackResult } from "./nightwatch";

const LOGIN_USERNAME: string = "testAdmin1";
const LOGIN_PASSWORD: string = "password";

const USER_ADD_WIDGET: string = "testUser1";
const SEARCH_WIDGET: string = "Color";
const ADDED_WIDGETS = ["Color Client", "Color Server"];

const ADMIN_EMAIL = "testAdmin1@ozone.test";
const NEW_USER_EMAIL = "new_user_email@email.com";
const NEW_USER_DISPLAY_NAME = "Edited User";
const NEW_USER_USERNAME = "newUser1";

function openEditSectionForUser(browser: NightwatchAPI, userDisplayName: string, section?: string) {
    let relevant_row: number = 0;

    browser.elements(
        "css selector",
        `${UserAdminWidget.Main.DIALOG} div[role='rowgroup'] div[role='row'] > div:first-child`,
        (elements: NightwatchCallbackResult) => {
            elements.value.forEach((element: any, i: number) => {
                browser.elementIdText(element.ELEMENT, (result) => {
                    if (result.value === userDisplayName) {
                        relevant_row = i;
                        browser.getAttribute(
                            `${UserAdminWidget.Main.DIALOG} div[role='rowgroup']:nth-child(${i +
                                1}) div[role='row'] > div:last-child button[data-element-id='user-admin-widget-edit-button']`,
                            "disabled",
                            function(isDisabled) {
                                this.assert.equal(
                                    isDisabled.value,
                                    null,
                                    "[User Admin Widget] created user can be edited"
                                );
                            }
                        );
                    }
                });
            });
        }
    );
    browser.click(
        `${UserAdminWidget.Main.DIALOG} div[role='rowgroup']:nth-child(${relevant_row +
            1}) div[role='row'] > div:last-child button[data-element-id='user-admin-widget-edit-button']`
    );

    if (section) {
        return browser.click(section);
    } else {
        return browser.waitForElementPresent(
            UserAdminWidget.PropertiesGroup.FORM,
            1000,
            undefined,
            undefined,
            "[Edit User Form] is present"
        );
    }
}

module.exports = {
    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Users in the User Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Test Administrator 1",
            "[User Admin Widget] Displays user information"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can view all Preferences in the User Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.click(AdminWidget.EDIT_PREFERENCE_USER_ID);

        browser.pause(1000);
        // click preferences tab
        browser.click(AdminWidget.PREFERENCES_TAB);

        browser.pause(1000);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Widget] Displays preference information"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can create a new User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Test Administrator 1",
            "[User Admin Widget] Displays user information"
        );

        browser.click(AdminWidget.USER_ADMIN_CREATE_BUTTON);

        browser.pause(1000);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Username",
            "[User Admin Create Form] is visible"
        );

        browser
            .setValue(AdminWidget.USER_NAME_FIELD, NEW_USER_USERNAME)
            .setValue(AdminWidget.FULL_NAME_FIELD, NEW_USER_DISPLAY_NAME)
            .setValue(AdminWidget.EMAIL_FIELD, NEW_USER_EMAIL);

        browser.click(AdminWidget.SUBMIT_BUTTON);

        browser
            .pause(2000)
            .waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_DISPLAY_NAME,
            "[User Admin Widget] New user successfully created"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can edit a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_USERNAME,
            "[User Admin Widget] Displays user information we wish to edit"
        );

        // browser.click(AdminWidget.EDIT_USER_ID);
        browser
            .setValue(AdminWidget.SEARCH_FIELD, NEW_USER_EMAIL)
            .click(
                `${
                    UserAdminWidget.Main.DIALOG
                } div[role='rowgroup']:nth-child(1) div[role='row'] > div:last-child button[data-element-id='user-admin-widget-edit-button']`
            );

        browser.pause(5000);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Username",
            "[User Admin Create Form] is visible"
        );

        browser.clearValue(AdminWidget.FULL_NAME_FIELD).clearValue(AdminWidget.EMAIL_FIELD);

        browser
            .setValue(AdminWidget.FULL_NAME_FIELD, NEW_USER_DISPLAY_NAME)
            .setValue(AdminWidget.EMAIL_FIELD, NEW_USER_EMAIL);

        browser.click(AdminWidget.SUBMIT_BUTTON);

        browser.getAttribute(AdminWidget.SUBMIT_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Edit User Submit Button] is disabled");
        });

        browser
            .click(AdminWidget.USER_ADMIN_BACK_BUTTON)
            .waitForElementNotPresent(AdminWidget.SUBMIT_BUTTON, 1000, "[Edit User Form] is closed");

        browser
            .pause(1000)
            .waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_DISPLAY_NAME,
            "[User Admin Widget] User successfully edited"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can add a widget to a user": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(UserAdminWidget.Main.DIALOG, 2000, "[User Admin Widget] is visible");

        browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(USER_ADD_WIDGET);

        openEditSectionForUser(
            browser,
            USER_ADD_WIDGET,
            `${UserAdminWidget.EditUser.TAB_WIDGETS}`
        ).waitForElementVisible(UserAdminWidget.WidgetsUser.ADD_BUTTON, 2000, "[User Widgets Interface] is visible");

        // Could check here to see if there are no widgets
        browser
            .click(UserAdminWidget.WidgetsUser.ADD_BUTTON)
            .waitForElementPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                undefined,
                undefined,
                "[Widget Selection Dialog] is present"
            );

        browser
            .setValue(GlobalElements.GENERIC_TABLE_ADD_SEARCH_FIELD, SEARCH_WIDGET)
            .pause(1000)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='rowgroup']:nth-child(1)`)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='rowgroup']:nth-child(2)`)
            .click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                undefined,
                undefined,
                "[Widget Selection Dialog] is closed"
            );

        ADDED_WIDGETS.forEach((widget: string) => {
            browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(widget);
        });

        browser
            .click(UserAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(UserAdminWidget.WidgetsUser.ADD_BUTTON, 1000, "[Edit User Form] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can remove a widget from a user": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(UserAdminWidget.Main.DIALOG, 2000, "[User Admin Widget] is visible");

        openEditSectionForUser(
            browser,
            USER_ADD_WIDGET,
            `${UserAdminWidget.EditUser.TAB_WIDGETS}`
        ).waitForElementVisible(UserAdminWidget.WidgetsUser.ADD_BUTTON, 2000, "[User Widgets Interface] is visible");

        ADDED_WIDGETS.forEach((widget: string) => {
            browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(widget);
        });

        browser
            .click(
                `${
                    UserAdminWidget.WidgetsUser.TAB
                } div[role='rowgroup']:nth-child(1) div[role='row'] > div:last-child button[data-element-id='user-admin-widget-delete-widget-button']`
            )
            .pause(250)
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .pause(500)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser
            .click(
                `${
                    UserAdminWidget.WidgetsUser.TAB
                } div[role='rowgroup']:nth-child(2) div[role='row'] > div:last-child button[data-element-id='user-admin-widget-delete-widget-button']`
            )
            .pause(250)
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .pause(500)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        // TODO - UNCOMMENT WHEN BACKEND IS FIXED
        // ADDED_WIDGETS.forEach((widget: string) => {
        //     browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.not.contain(widget);
        // });

        browser
            .click(UserAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(UserAdminWidget.WidgetsUser.ADD_BUTTON, 1000, "[Edit User Form] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can search for a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.setValue(AdminWidget.SEARCH_FIELD, NEW_USER_EMAIL);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_EMAIL,
            "[User Admin Widget] Displays user information we searched for"
        );

        browser.expect.element(AdminWidget.USER_ADMIN_WIDGET_DIALOG).text.to.not.contain(ADMIN_EMAIL);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_DISPLAY_NAME,
            "[User Admin Widget] User successfully edited"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can delete a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.USERS);

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 1000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_EMAIL,
            "[User Admin Widget] Displays user information we wish to delete"
        );

        browser
            .setValue(AdminWidget.SEARCH_FIELD, NEW_USER_EMAIL)
            .click(
                `${
                    UserAdminWidget.Main.DIALOG
                } div[role='rowgroup']:nth-child(1) div[role='row'] > div:last-child button[data-element-id='user-admin-widget-delete-button']`
            )
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.expect.element(AdminWidget.USER_ADMIN_WIDGET_DIALOG).text.to.not.contain(NEW_USER_EMAIL);

        browser.closeWindow().end();
    }
};
