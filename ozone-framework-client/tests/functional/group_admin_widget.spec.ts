import { NightwatchAPI, NightwatchCallbackResult } from "nightwatch";

import { GlobalElements, GroupAdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";


const LOGIN_USERNAME: string = 'testAdmin1';
const LOGIN_PASSWORD: string = 'password';

const NEW_GROUP_NAME: string = 'NewGroup';
const NEW_GROUP_DISPLAY_NAME: string = 'New Group Display Name';
const NEW_GROUP_DESCRIPTION: string = 'New Group Description';

export default {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Groups in the Group Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.assert.containsText(
            GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG, "OWF Administrators",
            "[User Group Widget] Displays group information");

        browser.closeWindow().end();
    },

    "As an Administrator, I can create a new group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.waitForElementVisible(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG_CREATE_BUTTON, 1000, "[Group Admin Widget Create Button] is visible");

        browser
            .click(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG_CREATE_BUTTON)
            .waitForElementPresent(GroupAdminWidget.CREATE_GROUP_DIALOG_FORM, 1000, undefined, undefined, "[Create Group Form] is present");
        
        browser.getAttribute(GroupAdminWidget.CREATE_GROUP_DIALOG_SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, 'true', "[Create Group Submit Button] is disabled");
        });
        
        browser
            .setValue(GroupAdminWidget.CREATE_GROUP_DIALOG_NAME_INPUT, NEW_GROUP_NAME)
            .setValue(GroupAdminWidget.CREATE_GROUP_DIALOG_DISPLAY_NAME_INPUT, NEW_GROUP_DISPLAY_NAME)
            .setValue(GroupAdminWidget.CREATE_GROUP_DIALOG_DESCRIPTION_INPUT, NEW_GROUP_DESCRIPTION)
            .pause(1000);

        browser.getAttribute(GroupAdminWidget.CREATE_GROUP_DIALOG_SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, null, "[Create Group Submit Button] is enabled");
        });

        browser
            .click(GroupAdminWidget.CREATE_GROUP_DIALOG_SUBMIT_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.CREATE_GROUP_DIALOG_FORM, 1000, "[Create Group Form] is closed");
    
        browser.expect.element(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG).text.to.contain(NEW_GROUP_NAME);

        browser.closeWindow().end();
    },

    "As an Administrator, I can delete a group": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.expect.element(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG).text.to.contain(NEW_GROUP_NAME);

        browser.elements("css selector", `${GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG} div[role='rowgroup'] div[role='row'] > div:first-child`, (elements: NightwatchCallbackResult) => {
            let relevant_row: number = 0;

            elements.value.forEach((element: any, i: number) => {
                browser.elementIdText(element.ELEMENT, (result) => {
                    if(result.value === NEW_GROUP_NAME) {
                        relevant_row = i;
                        browser.getAttribute(`${GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG} div[role='rowgroup']:nth-child(${i+1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-delete-button']`, 'disabled', function(result) {
                            this.assert.equal(result.value, null, "[Group Admin Widget] created group can be deleted");
                        });                        
                    } else if ((result.value as string).trim().length > 0) {
                        browser.getAttribute(`${GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG} div[role='rowgroup']:nth-child(${i+1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-delete-button']`, 'disabled', function(result) {
                            this.assert.equal(result.value, 'true', "[Group Admin Widget] irrelevant group can not be deleted");
                        }); 
                    }
                });
            });

            browser
                .click(`${GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG} div[role='rowgroup']:nth-child(${relevant_row + 1}) div[role='row'] > div:last-child button[data-element-id='group-admin-widget-delete-button']`)
                .waitForElementPresent(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON, 1000, undefined, undefined, "[Confirmation Dialog] is present")
                .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
                .waitForElementNotPresent(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON, 1000, "[Confirmation Dialog] is not present");

        });

        browser.expect.element(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG).text.to.not.contain(NEW_GROUP_NAME);

        browser.closeWindow().end();
    }
};
