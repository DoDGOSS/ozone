import { NightwatchAPI } from "nightwatch";

import { CreateDashboardDialog, MainPage } from "./selectors";

import { loggedInAs } from "./helpers";


module.exports = {

    "As a user, I want to be able to create a new Dashboard": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser
        .waitForElementVisible(MainPage.DASHBOARD_BUTTON, 2000, "[Dashboard Button] is visible");

        browser.click(MainPage.DASHBOARD_BUTTON)
          .waitForElementVisible(MainPage.CREATE_DASHBOARD_BUTTON, 2000, "[Create Dashboard Button] is visible");

        browser.click(MainPage.CREATE_DASHBOARD_BUTTON)
          .waitForElementVisible(CreateDashboardDialog.SUBMIT, 2000, "[Create Dashboard Submit Button] is visible");

        const newName = "Test Dashboard";

        browser.setValue(CreateDashboardDialog.NAME_FIELD, newName);

        browser.click(CreateDashboardDialog.SUBMIT)
        .waitForElementNotPresent(MainPage.CREATE_DASHBOARD_BUTTON, 1000, "[Create Dashboard Dialog] is closed");

        browser.closeWindow().end();

      }
    };
