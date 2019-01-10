import { NightwatchAPI } from "nightwatch";

import { GroupAdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";


export default {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Groups in the Group Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.assert.containsText(
            GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG, "OWF Administrators",
            "[User Group Widget] Displays group information");

        browser.closeWindow().end();
    },

    "As an Administrator, I can create a new group": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG, 1000, "[Group Admin Widget] is visible");

        browser.waitForElementVisible(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG_CREATE_BUTTON, 1000, "[Group Admin Widget Create Button] is visible");

        browser
            .click(GroupAdminWidget.GROUP_ADMIN_WIDGET_DIALOG_CREATE_BUTTON)
            .waitForElementPresent(GroupAdminWidget.CREATE_GROUP_DIALOG_FORM, 1000, undefined, undefined, "[Create Group Form] is present");
        
        browser.getAttribute(GroupAdminWidget.CREATE_GROUP_DIALOG_SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, 'true', "[Create Group Submit Button] is disabled");
        });
        
        browser
            .setValue(GroupAdminWidget.CREATE_GROUP_DIALOG_NAME_INPUT, 'NewGroup')
            .setValue(GroupAdminWidget.CREATE_GROUP_DIALOG_DISPLAY_NAME_INPUT, 'New Group Display Name')
            .setValue(GroupAdminWidget.CREATE_GROUP_DIALOG_DESCRIPTION_INPUT, 'New Group Description')
            .pause(1000);

        browser.getAttribute(GroupAdminWidget.CREATE_GROUP_DIALOG_SUBMIT_BUTTON, 'disabled', function(result) {
            this.assert.equal(result.value, null, "[Create Group Submit Button] is enabled");
        });

        browser
            .click(GroupAdminWidget.CREATE_GROUP_DIALOG_SUBMIT_BUTTON)
            .waitForElementNotPresent(GroupAdminWidget.CREATE_GROUP_DIALOG_FORM, 1000, "[Create Group Form] is closed");
    
        browser.closeWindow().end();
    }
};
