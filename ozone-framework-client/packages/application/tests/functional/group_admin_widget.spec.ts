import { NightwatchAPI, NightwatchCallbackResult } from "nightwatch";

import { GlobalElements, GroupAdminWidget, MainPage, StackDialog } from "./selectors";

import { loggedInAs } from "./helpers";
import { GroupAdmin } from "./pages";

const LOGIN_USERNAME: string = "admin";
const LOGIN_PASSWORD: string = "password";

const NEW_GROUP_NAME: string = "NewGroup";
const NEW_GROUP_MODIFIED_NAME: string = "Modified New Group";
const NEW_GROUP_DISPLAY_NAME: string = "New Group Display Name";
const NEW_GROUP_DESCRIPTION: string = "New Group Description";

const SEARCH_WIDGET: string = "Color";
const ADDED_WIDGETS = ["Color Client", "Color Server"];
const DEFAULT_STACK = "Untitled (default)";

const DEFAULT_USER_EMAILS = ["admin@goss.com", "user@goss.com"];

function openEditSectionForGroup(browser: NightwatchAPI, userDisplayName: string, section?: string) {
    browser.click(`${GroupAdminWidget.Main.DIALOG} div[role='grid'] div[role='row'] ${GlobalElements.STD_EDIT_BUTTON}`);

    if (section) {
        return browser.click(section);
    } else {
        return browser.waitForElementPresent(
            GroupAdminWidget.PropertiesGroup.FORM,
            1000,
            undefined,
            undefined,
            "[Edit Group Form] is present"
        );
    }
}

module.exports = {
    "As an Administrator, I can view all Groups in the Group Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect
            .element(GroupAdminWidget.Main.DIALOG)
            .text.to.contain("OWF Administrators")
            .before(30 * 1000);

        browser.closeWindow().end();
    },

    "As an Administrator, I want to search for a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.clearValue(GroupAdminWidget.Main.SEARCH_FIELD).setValue(GroupAdminWidget.Main.SEARCH_FIELD, "USER");

        browser.assert.containsText(
            GroupAdminWidget.Main.DIALOG,
            "OWF Users",
            "[Group Admin Widget] Displays information we searched for"
        );

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.not.contain("Administrators");

        browser.closeWindow().end();
    },

    "As an Administrator, I can create a new group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            GroupAdminWidget.Main.CREATE_BUTTON,
            1000,
            "[Group Admin Widget Create Button] is visible"
        );

        browser
            .click(GroupAdminWidget.Main.CREATE_BUTTON)
            .waitForElementPresent(
                GroupAdminWidget.GroupProperties.FORM,
                1000,
                undefined,
                undefined,
                "[Create Group Form] is present"
            );

        browser.getAttribute(GroupAdminWidget.GroupProperties.SUBMIT_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Create Group Submit Button] is disabled");
        });

        browser
            .setValue(GroupAdminWidget.GroupProperties.NAME_INPUT, NEW_GROUP_NAME)
            .setValue(GroupAdminWidget.GroupProperties.DISPLAY_NAME_INPUT, NEW_GROUP_DISPLAY_NAME)
            .setValue(GroupAdminWidget.GroupProperties.DESCRIPTION_INPUT, NEW_GROUP_DESCRIPTION)
            .pause(1000);

        browser.getAttribute(GroupAdminWidget.GroupProperties.SUBMIT_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, null, "[Create Group Submit Button] is enabled");
        });

        browser
            .click(GroupAdminWidget.GroupProperties.SUBMIT_BUTTON)
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.GroupProperties.FORM, 1000, "[Create Group Form] is closed");

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_NAME);

        browser.closeWindow().end();
    },

    "As an Administrator, I can edit a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_NAME);

        openEditSectionForGroup(browser, NEW_GROUP_NAME);

        browser
            .clearValue(GroupAdminWidget.PropertiesGroup.NAME_INPUT)
            .setValue(GroupAdminWidget.PropertiesGroup.NAME_INPUT, NEW_GROUP_MODIFIED_NAME)
            .pause(1000);

        browser.getAttribute(GroupAdminWidget.PropertiesGroup.SUBMIT_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, null, "[Edit Group Submit Button] is enabled");
        });

        browser.click(GroupAdminWidget.PropertiesGroup.SUBMIT_BUTTON).pause(1000);

        browser.getAttribute(GroupAdminWidget.PropertiesGroup.SUBMIT_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Edit Group Submit Button] is disabled");
        });

        browser
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.PropertiesGroup.FORM, 1000, "[Edit Group Form] is closed");

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);
        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.not.contain(NEW_GROUP_NAME);

        browser.closeWindow().end();
    },

    "As an Administrator, I can add a user to a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        openEditSectionForGroup(
            browser,
            NEW_GROUP_MODIFIED_NAME,
            `${GroupAdminWidget.EditGroup.TAB_USERS}`
        ).waitForElementVisible(GroupAdminWidget.UsersGroup.ADD_BUTTON, 2000, "[Group Users Interface] is visible");

        DEFAULT_USER_EMAILS.forEach((email: string) => {
            browser.expect.element(GroupAdminWidget.UsersGroup.TAB).text.to.not.contain(email);
        });

        browser
            .click(GroupAdminWidget.UsersGroup.ADD_BUTTON)
            .waitForElementPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                undefined,
                undefined,
                "[User Selection Dialog] is present"
            );

        browser
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='row']:nth-child(1)`)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='row']:nth-child(2)`)
            .click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                undefined,
                undefined,
                "[User Selection Dialog] is closed"
            );

        DEFAULT_USER_EMAILS.forEach((email: string) => {
            browser.expect.element(GroupAdminWidget.UsersGroup.TAB).text.to.contain(email);
        });

        browser
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.UsersGroup.ADD_BUTTON, 1000, "[Edit Group Form] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can remove a user from a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        openEditSectionForGroup(
            browser,
            NEW_GROUP_MODIFIED_NAME,
            `${GroupAdminWidget.EditGroup.TAB_USERS}`
        ).waitForElementVisible(GroupAdminWidget.UsersGroup.ADD_BUTTON, 2000, "[Group Users Interface] is visible");

        DEFAULT_USER_EMAILS.forEach((email: string) => {
            browser.expect.element(GroupAdminWidget.UsersGroup.TAB).text.to.contain(email);
        });

        browser
            .click(
                `${GroupAdminWidget.UsersGroup.TAB} div[role='row']:nth-child(1) div ${GlobalElements.STD_DELETE_BUTTON}`
            )
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .pause(250)
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .pause(500)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );
        browser.pause(500);

        browser
            .click(
                `${GroupAdminWidget.UsersGroup.TAB} div[role='row']:nth-child(1) div ${GlobalElements.STD_DELETE_BUTTON}`
            )
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .pause(250)
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .pause(500)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );
        browser.pause(500);

        DEFAULT_USER_EMAILS.forEach((email: string) => {
            browser.expect.element(GroupAdminWidget.UsersGroup.TAB).text.to.not.contain(email);
        });

        browser
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.UsersGroup.ADD_BUTTON, 1000, "[Edit Group Form] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can add a widget to a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        openEditSectionForGroup(
            browser,
            NEW_GROUP_MODIFIED_NAME,
            `${GroupAdminWidget.EditGroup.TAB_WIDGETS}`
        ).waitForElementVisible(GroupAdminWidget.WidgetsGroup.ADD_BUTTON, 2000, "[Group Widgets Interface] is visible");

        browser
            .click(GroupAdminWidget.WidgetsGroup.ADD_BUTTON)
            .waitForElementPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                "[Widget Selection Dialog] is present"
            );

        browser
            .setValue(GlobalElements.GENERIC_TABLE_ADD_SEARCH_FIELD, SEARCH_WIDGET)
            .pause(1000)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='row']:nth-child(1) > div`)
            .click(`${GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG} div[role='row']:nth-child(2) > div`)
            .click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
                1000,
                "[Widget Selection Dialog] is closed"
            );

        ADDED_WIDGETS.forEach((widget: string) => {
            browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(widget);
        });

        browser
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.WidgetsGroup.ADD_BUTTON, 1000, "[Edit group Form] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can remove a widget from a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        openEditSectionForGroup(
            browser,
            NEW_GROUP_MODIFIED_NAME,
            `${GroupAdminWidget.EditGroup.TAB_WIDGETS}`
        ).waitForElementVisible(GroupAdminWidget.WidgetsGroup.ADD_BUTTON, 2000, "[Group Widgets Interface] is visible");

        browser
            .click(`${GlobalElements.STD_DELETE_BUTTON}[data-widget-title="Color Client"]`)
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
            .click(`${GlobalElements.STD_DELETE_BUTTON}[data-widget-title="Color Server"]`)
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
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.WidgetsGroup.ADD_BUTTON, 1000, "[Edit Group Form] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can add a stack to a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        // share a stack
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");
        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");
        browser
            .pause(1000)
            .click(StackDialog.getShareButtonForStack(DEFAULT_STACK))
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present."
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .click(MainPage.DIALOG_CLOSE);

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        openEditSectionForGroup(
            browser,
            NEW_GROUP_MODIFIED_NAME,
            `${GroupAdminWidget.EditGroup.TAB_STACKS}`
        ).waitForElementVisible(GroupAdminWidget.StacksGroup.ADD_BUTTON, 2000, "[Group Stacks Interface] is visible");

        browser
            .click(GroupAdminWidget.StacksGroup.ADD_BUTTON)
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

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(DEFAULT_STACK);

        browser
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.StacksGroup.ADD_BUTTON, 1000, "[Group Setup] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can remove a stack from a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        openEditSectionForGroup(
            browser,
            NEW_GROUP_MODIFIED_NAME,
            `${GroupAdminWidget.EditGroup.TAB_STACKS}`
        ).waitForElementVisible(GroupAdminWidget.StacksGroup.ADD_BUTTON, 2000, "[Group Stacks Interface] is visible");

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
            .click(GroupAdminWidget.Main.BACK_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.StacksGroup.ADD_BUTTON, 1000, "[Group Setup] is closed");

        browser.closeWindow().end();
    },

    "As an Administrator, I can delete a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        GroupAdmin.navigateTo(browser);

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        browser.elements(
            "css selector",
            `${GroupAdminWidget.Main.DIALOG} div[role='row'] > div:nth-child(1)`,
            (elements: NightwatchCallbackResult) => {
                let relevant_row: number = 0;

                elements.value.forEach((element: any, i: number) => {
                    browser.elementIdText(element[Object.keys(element)[0]], (result) => {
                        if (result.value === NEW_GROUP_MODIFIED_NAME) {
                            relevant_row = i;
                            browser.getAttribute(
                                `${GroupAdminWidget.Main.DIALOG} div[role='row']:nth-child(${i + 1}) div ${
                                    GlobalElements.STD_DELETE_BUTTON
                                }`,
                                "disabled",
                                function(modifiedResult) {
                                    this.assert.equal(
                                        modifiedResult.value,
                                        null,
                                        "[Group Admin Widget] created group can be deleted"
                                    );
                                }
                            );
                        } else if ((result.value as string).trim().length > 0) {
                            browser.getAttribute(
                                `${GroupAdminWidget.Main.DIALOG} div[role='row']:nth-child(${i + 1}) div ${
                                    GlobalElements.STD_DELETE_BUTTON
                                }`,
                                "disabled",
                                function(modifiedResult) {
                                    this.assert.equal(
                                        modifiedResult.value,
                                        "true",
                                        "[Group Admin Widget] irrelevant group can not be deleted"
                                    );
                                }
                            );
                        }
                    });
                });

                browser
                    .click(
                        `${GroupAdminWidget.Main.DIALOG} div[role='row']:nth-child(${relevant_row + 1}) div ${
                            GlobalElements.STD_DELETE_BUTTON
                        }`
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
            }
        );

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.not.contain(NEW_GROUP_MODIFIED_NAME);

        browser.closeWindow().end();
    }
};
