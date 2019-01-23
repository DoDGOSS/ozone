import { NightwatchAPI, NightwatchCallbackResult } from "nightwatch";

import { GlobalElements, GroupAdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";


const LOGIN_USERNAME: string = 'testAdmin1';
const LOGIN_PASSWORD: string = 'password';

const NEW_GROUP_NAME: string = 'NewGroup';
const NEW_GROUP_MODIFIED_NAME: string = 'Modified New Group';
const NEW_GROUP_DISPLAY_NAME: string = 'New Group Display Name';
const NEW_GROUP_DESCRIPTION: string = 'New Group Description';

export default {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Groups in the Group Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.Main.DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.assert.containsText(
            GroupAdminWidget.Main.DIALOG, "OWF Administrators",
            "[User Group Widget] Displays group information");

        browser.closeWindow().end();
    },

    "As an Administrator, I want to search for a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.Main.DIALOG, 1000, "[Group Admin Widget] is visible");

        browser
            .clearValue(GroupAdminWidget.Main.SEARCH_FIELD)
            .setValue(GroupAdminWidget.Main.SEARCH_FIELD, "USER");

        browser.assert.containsText(
            GroupAdminWidget.Main.DIALOG, "OWF Users",
            "[Group Admin Widget] Displays information we searched for");


        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.not.contain("Administrators");

        browser.closeWindow().end();
    },

    "As an Administrator, I can create a new group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.Main.DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.waitForElementVisible(GroupAdminWidget.Main.CREATE_BUTTON, 1000, "[Group Admin Widget Create Button] is visible");

        browser
            .click(GroupAdminWidget.Main.CREATE_BUTTON)
            .waitForElementPresent(GroupAdminWidget.CreateGroup.FORM, 1000, undefined, undefined, "[Create Group Form] is present");
        
        browser.getAttribute(GroupAdminWidget.CreateGroup.SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, 'true', "[Create Group Submit Button] is disabled");
        });
        
        browser
            .setValue(GroupAdminWidget.CreateGroup.NAME_INPUT, NEW_GROUP_NAME)
            .setValue(GroupAdminWidget.CreateGroup.DISPLAY_NAME_INPUT, NEW_GROUP_DISPLAY_NAME)
            .setValue(GroupAdminWidget.CreateGroup.DESCRIPTION_INPUT, NEW_GROUP_DESCRIPTION)
            .pause(1000);

        browser.getAttribute(GroupAdminWidget.CreateGroup.SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, null, "[Create Group Submit Button] is enabled");
        });

        browser
            .click(GroupAdminWidget.CreateGroup.SUBMIT_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.CreateGroup.FORM, 1000, "[Create Group Form] is closed");
    
        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_NAME);

        browser.closeWindow().end();
    },

    "As an Administrator, I can edit a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.Main.DIALOG, 2000, "[Group Admin Widget] is visible");

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_NAME);

        browser.elements("css selector", `${GroupAdminWidget.Main.DIALOG} div[role='rowgroup'] div[role='row'] > div:first-child`, (elements: NightwatchCallbackResult) => {
            let relevant_row: number = 0;

            elements.value.forEach((element: any, i: number) => {
                browser.elementIdText(element.ELEMENT, (result) => {
                    if(result.value === NEW_GROUP_NAME) {
                        relevant_row = i;
                        browser.getAttribute(`${GroupAdminWidget.Main.DIALOG} div[role='rowgroup']:nth-child(${i+1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-edit-button']`, 'disabled', function(isDisabled) {
                            this.assert.equal(isDisabled.value, null, "[Group Admin Widget] created group can be edited");
                        });                        
                    }
                });
            });

            browser
                .click(`${GroupAdminWidget.Main.DIALOG} div[role='rowgroup']:nth-child(${relevant_row + 1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-edit-button']`)
                .waitForElementPresent(GroupAdminWidget.EditGroup.FORM, 1000, undefined, undefined, "[Edit Group Form] is present");
            });
        
        browser
            .clearValue(GroupAdminWidget.EditGroup.NAME_INPUT)
            .setValue(GroupAdminWidget.EditGroup.NAME_INPUT, NEW_GROUP_MODIFIED_NAME)
            .pause(1000);

        browser.getAttribute(GroupAdminWidget.EditGroup.SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, null, "[Create Group Submit Button] is enabled");
        });

        browser
            .click(GroupAdminWidget.EditGroup.SUBMIT_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.EditGroup.FORM, 1000, "[Edit Group Form] is closed");

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);
        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.not.contain(NEW_GROUP_NAME);

        browser.closeWindow().end();
    },

    "As an Administrator, I can delete a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.Main.DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_MODIFIED_NAME);

        browser.elements("css selector", `${GroupAdminWidget.Main.DIALOG} div[role='rowgroup'] div[role='row'] > div:first-child`, (elements: NightwatchCallbackResult) => {
            let relevant_row: number = 0;

            elements.value.forEach((element: any, i: number) => {
                browser.elementIdText(element.ELEMENT, (result) => {
                    if(result.value === NEW_GROUP_MODIFIED_NAME) {
                        relevant_row = i;
                        browser.getAttribute(`${GroupAdminWidget.Main.DIALOG} div[role='rowgroup']:nth-child(${i+1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-delete-button']`, 'disabled', function(modifiedResult) {
                            this.assert.equal(modifiedResult.value, null, "[Group Admin Widget] created group can be deleted");
                        });                        
                    } else if ((result.value as string).trim().length > 0) {
                        browser.getAttribute(`${GroupAdminWidget.Main.DIALOG} div[role='rowgroup']:nth-child(${i+1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-delete-button']`, 'disabled', function(modifiedResult) {
                            this.assert.equal(modifiedResult.value, 'true', "[Group Admin Widget] irrelevant group can not be deleted");
                        }); 
                    }
                });
            });

            browser
                .click(`${GroupAdminWidget.Main.DIALOG} div[role='rowgroup']:nth-child(${relevant_row + 1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-delete-button']`)
                .waitForElementPresent(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON, 1000, undefined, undefined, "[Confirmation Dialog] is present")
                .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
                .waitForElementNotPresent(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON, 1000, "[Confirmation Dialog] is not present");

        });

        browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.not.contain(NEW_GROUP_MODIFIED_NAME);

        browser.closeWindow().end();
    },
};
