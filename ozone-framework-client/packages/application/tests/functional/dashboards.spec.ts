import { NightwatchAPI } from "nightwatch";

import {DashboardDialog, GlobalElements, MainPage} from "./selectors";

import { loggedInAs } from "./helpers";

module.exports = {
    "As a user, I want to be able to create a new Dashboard": (browser: NightwatchAPI) => {

        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.DASHBOARD_BUTTON, 2000, "[Dashboard Button] is visible");

        browser
            .click(MainPage.DASHBOARD_BUTTON)
            .waitForElementVisible(DashboardDialog.CREATE_DASHBOARD_BUTTON, 2000, "[Create Dashboard Button] is visible");

        browser
            .click(DashboardDialog.CREATE_DASHBOARD_BUTTON)
            .waitForElementVisible(DashboardDialog.CreateDashboard.SUBMIT, 2000, "[Create Dashboard Submit Button] is visible");

        browser.setValue(DashboardDialog.CreateDashboard.NAME_FIELD, DashboardDialog.CreateDashboard.CREATE_DASHBOARD_NAME);

        browser
            .click(DashboardDialog.CreateDashboard.SUBMIT)
            .waitForElementNotPresent(DashboardDialog.CREATE_DASHBOARD_BUTTON, 1000, "[Create Dashboard Dialog] is closed");

        browser.closeWindow().end();
    },

    //    Edit
    "As an administrator, I can edit a dashboard": (browser: NightwatchAPI) => {


        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.DASHBOARD_BUTTON, 2000, "[Dashboard Button] is visible");

        browser
            .click(MainPage.DASHBOARD_BUTTON)
            .waitForElementVisible(DashboardDialog.DASHBOARD_DIALOG, 2000, "[Dashboard Dialog] is visible");


        browser.click(DashboardDialog.EDIT_DASHBOARD_ID);

        browser.pause(2000);

        browser.clearValue(DashboardDialog.CreateDashboard.NAME_FIELD);

        browser.setValue(DashboardDialog.CreateDashboard.NAME_FIELD, DashboardDialog.CreateDashboard.EDIT_DASHBOARD_NAME);

        browser.click(DashboardDialog.CreateDashboard.SUBMIT);

        browser.waitForElementVisible(DashboardDialog.DASHBOARD_DIALOG, 2000, "[Dashboard Dialog] is visible");

        browser.assert.containsText(
            DashboardDialog.DASHBOARD_DIALOG,
            DashboardDialog.CreateDashboard.EDIT_DASHBOARD_NAME,
            "[Dashboard Dialog] Dashboard successfully edited"
        );

        browser.closeWindow().end();
    },

    //    Delete with confirmation
    "As an administrator, I can delete a dashboard": (browser: NightwatchAPI) => {

        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.DASHBOARD_BUTTON, 2000, "[Dashboard Button] is visible");

        browser
            .click(MainPage.DASHBOARD_BUTTON)
            .waitForElementVisible(DashboardDialog.DASHBOARD_DIALOG, 2000, "[Dashboard Dialog] is visible");

        browser
            .click(DashboardDialog.DELETE_DASHBOARD_ID)
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

        browser.expect.element(DashboardDialog.DASHBOARD_DIALOG).text.to.not.contain(DashboardDialog.CreateDashboard.EDIT_DASHBOARD_NAME);

        browser.closeWindow().end();

    }



};
