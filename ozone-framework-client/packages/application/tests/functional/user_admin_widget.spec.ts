import { NightwatchAPI } from "nightwatch";

import { AdminWidget, GlobalElements, UserAdminWidget, MainPage, StackDialog } from "./selectors";

import { loggedInAs } from "./helpers";
import { UserAdmin } from "./pages";

const LOGIN_USERNAME: string = "admin";
const LOGIN_PASSWORD: string = "password";

const USER_ADD_WIDGET: string = "user";
const SEARCH_WIDGET: string = "Color";
const ADDED_WIDGETS = ["Color Client", "Color Server"];

const ADMIN_EMAIL = "admin@goss.com";
const NEW_USER_EMAIL = "new_user_email@email.com";
const NEW_USER_DISPLAY_NAME = "Edited User";
const NEW_USER_USERNAME = "newUser1";

const NEW_USER_PREFERENCE_NAMESPACE = "owf";
const NEW_USER_PREFERENCE_PATH = "owf.test.preference";
const NEW_USER_PREFERENCE_VALUE = "myTestPreference";

const DEFAULT_STACK = "Untitled";

function openEditSectionForUser(browser: NightwatchAPI, userDisplayName: string, section?: string) {
    browser.click(
        `${UserAdminWidget.Main.DIALOG} div[data-role='user-admin-widget-actions'][data-username='${userDisplayName}'] ${GlobalElements.STD_EDIT_BUTTON}`
    );

    if (section) {
        return browser.click(section);
    } else {
        return browser.waitForElementPresent(UserAdminWidget.PropertiesGroup.FORM, 1000, "[Edit User Form] is present");
    }
}

module.exports = {
    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Users in the User Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Test Administrator 1",
            "[User Admin Widget] Displays user information"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can view all Preferences in the User Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.click(AdminWidget.userTableEditButton("user"));

        browser.waitForElementVisible(AdminWidget.PREFERENCES_TAB, 2000);
        browser.click(AdminWidget.PREFERENCES_TAB);

        browser.pause(2000);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Widget] Displays preference information"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can create a new User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

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
            .click(AdminWidget.USER_ADMIN_BACK_BUTTON)
            .waitForElementNotPresent(AdminWidget.SUBMIT_BUTTON, 1000, "[Edit User Form] is closed");

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 3000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_EMAIL,
            "[User Admin Widget] New user successfully created"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can edit a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_EMAIL,
            "[User Admin Widget] Displays user information we wish to edit"
        );

        browser.waitForElementVisible(AdminWidget.SEARCH_FIELD, 1000, "[User Widget Search field] is visible");

        // browser.click(AdminWidget.EDIT_USER_ID);

        browser
            .setValue(AdminWidget.SEARCH_FIELD, NEW_USER_USERNAME)
            .click(
                `${UserAdminWidget.Main.DIALOG} div[data-role='user-admin-widget-actions'][data-username='${NEW_USER_USERNAME}'] ${GlobalElements.STD_EDIT_BUTTON}`
            )
            .waitForElementNotPresent("div.bp3-spinner");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Username",
            "[User Admin Edit Form] is visible"
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

        browser.waitForElementVisible(AdminWidget.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_DISPLAY_NAME,
            "[User Admin Widget] User successfully edited"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can add a widget to a user": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(USER_ADD_WIDGET);

        openEditSectionForUser(
            browser,
            USER_ADD_WIDGET,
            `${UserAdminWidget.EditUser.TAB_WIDGETS}`
        ).waitForElementVisible(UserAdminWidget.WidgetsUser.ADD_BUTTON, 2000, "[User Widgets Interface] is visible");

        browser.pause(1000);
        // Could check here to see if there are no widgets
        browser
            .click(UserAdminWidget.WidgetsUser.ADD_BUTTON)
            .pause(1000)
            .waitForElementPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                "[Widget Selection Dialog] is present"
            );
        browser.pause(1000);

        browser.waitForElementPresent(
            GlobalElements.GENERIC_TABLE_ADD_SEARCH_FIELD,
            1000,
            "[Widget Search Field] is present"
        );
        browser.pause(1000);
        browser
            .setValue(GlobalElements.GENERIC_TABLE_ADD_SEARCH_FIELD, SEARCH_WIDGET)
            .pause(1000)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='row']:nth-child(1) > div`)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='row']:nth-child(2) > div`)
            .click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                2000,
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

        UserAdmin.navigateTo(browser);

        openEditSectionForUser(
            browser,
            USER_ADD_WIDGET,
            `${UserAdminWidget.EditUser.TAB_WIDGETS}`
        ).waitForElementVisible(UserAdminWidget.WidgetsUser.ADD_BUTTON, 2000, "[User Widgets Interface] is visible");

        ADDED_WIDGETS.forEach((widget: string) => {
            browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(widget);
        });

        browser
            .click(`${GlobalElements.STD_DELETE_BUTTON}[data-widget-title="Color Client"]`)
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser
            .click(`${GlobalElements.STD_DELETE_BUTTON}[data-widget-title="Color Server"]`)
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        // TODO - UNCOMMENT WHEN BACKEND IS FIXED
        // ADDED_WIDGETS.forEach((widget: string) => {
        //     browser.expect.element(UserAdminWidgetWidget.Main.DIALOG).text.to.not.contain(widget);
        // });

        browser
            .click(UserAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(UserAdminWidget.WidgetsUser.ADD_BUTTON, 1000, "[Edit User Form] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can search for a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

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

    "As an Administrator, I can create a new preference for a user": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Test Administrator 1",
            "[User Admin Widget] Displays user information"
        );

        browser.click(AdminWidget.userTableEditButton("user"));

        browser.waitForElementVisible(AdminWidget.PREFERENCES_TAB, 2000);
        browser.click(AdminWidget.PREFERENCES_TAB);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Preference table] is visible"
        );

        browser.click(AdminWidget.USER_ADMIN_CREATE_BUTTON);

        browser.pause(2000);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Create Preference Form] is visible"
        );

        browser
            .setValue(AdminWidget.NAMESPACE_FIELD, NEW_USER_PREFERENCE_NAMESPACE)
            .setValue(AdminWidget.PATH_FIELD, NEW_USER_PREFERENCE_PATH)
            .setValue(AdminWidget.VALUE_FIELD, NEW_USER_PREFERENCE_VALUE);

        browser.waitForElementVisible(UserAdminWidget.UserPreferences.PREFERENCE_DIALOG, 2000);
        browser.waitForElementVisible(
            `${UserAdminWidget.UserPreferences.PREFERENCE_DIALOG} ${AdminWidget.SUBMIT_BUTTON}`,
            2000
        );
        browser.click(`${UserAdminWidget.UserPreferences.PREFERENCE_DIALOG} ${AdminWidget.SUBMIT_BUTTON}`);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Preference table] is visible"
        );

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_PREFERENCE_NAMESPACE,
            "[User Admin Widget] New User Preference successfully created"
        );

        browser.closeWindow().end();
    },

    "As an Administrator, I can add a stack to a user": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        //share the stack
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");
        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementNotPresent("div.bp3-spinner")
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser
            .click(StackDialog.getShareButtonForStack(DEFAULT_STACK))
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                5000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present."
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .click(MainPage.DIALOG_CLOSE);

        UserAdmin.navigateTo(browser);

        browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(USER_ADD_WIDGET);

        openEditSectionForUser(
            browser,
            USER_ADD_WIDGET,
            `${UserAdminWidget.EditUser.TAB_STACKS}`
        ).waitForElementVisible(UserAdminWidget.StacksUser.ADD_BUTTON, 2000, "[User Stacks Interface] is visible");

        browser
            .click(UserAdminWidget.StacksUser.ADD_BUTTON)
            .waitForElementPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                "[Stack Selection Dialog] is present"
            );

        browser
            .setValue(GlobalElements.GENERIC_TABLE_ADD_SEARCH_FIELD, DEFAULT_STACK)
            .pause(1000)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='row']:nth-child(1)`)
            .click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                "[Stack Selection Dialog] is closed"
            );

        browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(DEFAULT_STACK);

        browser
            .click(UserAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(UserAdminWidget.StacksUser.ADD_BUTTON, 1000, "[User Setup] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can remove a stack from a user": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.expect.element(UserAdminWidget.Main.DIALOG).text.to.contain(USER_ADD_WIDGET);

        openEditSectionForUser(
            browser,
            USER_ADD_WIDGET,
            `${UserAdminWidget.EditUser.TAB_STACKS}`
        ).waitForElementVisible(UserAdminWidget.StacksUser.ADD_BUTTON, 2000, "[User Stacks Interface] is visible");

        browser
            .click(`${GlobalElements.STD_DELETE_BUTTON}[data-widget-title="${DEFAULT_STACK}"]`)
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                10000,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                10000,
                "[Confirmation Dialog] is not present"
            );

        browser
            .click(UserAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(UserAdminWidget.StacksUser.ADD_BUTTON, 1000, "[User Setup] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can delete a User": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_EMAIL,
            "[User Admin Widget] Displays user information we wish to delete"
        );

        browser
            .setValue(AdminWidget.SEARCH_FIELD, NEW_USER_EMAIL)
            .click(
                `${UserAdminWidget.Main.DIALOG} div[data-role='user-admin-widget-actions'][data-username='${NEW_USER_USERNAME}'] ${GlobalElements.STD_DELETE_BUTTON}`
            )
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
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
    },

    "As an Administrator, When I view preferences for a selected user, I should see preferences that are assigned to that user.": (
        browser: NightwatchAPI
    ) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        UserAdmin.navigateTo(browser);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Test Administrator 1",
            "[User Admin Widget] Displays user information"
        );

        browser.click(AdminWidget.userTableEditButton("user"));

        browser.waitForElementVisible(AdminWidget.PREFERENCES_TAB, 2000);
        browser.click(AdminWidget.PREFERENCES_TAB);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Preference table] is visible"
        );

        browser.click(AdminWidget.USER_ADMIN_CREATE_BUTTON);

        browser.pause(2000);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Create Preference Form] is visible"
        );

        browser
            .setValue(AdminWidget.NAMESPACE_FIELD, NEW_USER_PREFERENCE_NAMESPACE)
            .setValue(AdminWidget.PATH_FIELD, NEW_USER_PREFERENCE_PATH)
            .setValue(AdminWidget.VALUE_FIELD, NEW_USER_PREFERENCE_VALUE);

        browser.waitForElementVisible(UserAdminWidget.UserPreferences.PREFERENCE_DIALOG, 2000);
        browser.waitForElementVisible(
            `${UserAdminWidget.UserPreferences.PREFERENCE_DIALOG} ${AdminWidget.SUBMIT_BUTTON}`,
            2000
        );
        browser.click(`${UserAdminWidget.UserPreferences.PREFERENCE_DIALOG} ${AdminWidget.SUBMIT_BUTTON}`);

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            "Namespace",
            "[User Admin Preference table] is visible"
        );

        browser.assert.containsText(
            AdminWidget.USER_ADMIN_WIDGET_DIALOG,
            NEW_USER_PREFERENCE_NAMESPACE,
            "[User Admin Widget] New User Preference successfully created"
        );

        browser.expect.element(AdminWidget.USER_ADMIN_WIDGET_DIALOG).text.to.not.contain("owf.admin");

        browser.closeWindow().end();
    }
};
