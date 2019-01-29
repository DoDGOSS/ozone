import { NightwatchAPI } from "nightwatch";

import { MainPage } from "./selectors";

import { loggedInAs } from "./helpers";


export default {

    "As an Administrator, I can view the widget sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1000, "[Widget Sidebar] is visible");

        browser.closeWindow().end();
    },

    "As an Administrator, I can search the widget sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1000, "[Widget Sidebar] is visible");

        browser
            .clearValue(MainPage.WIDGETS_SEARCH)
            .setValue(MainPage.WIDGETS_SEARCH, "2");

        browser.assert.containsText(
            MainPage.WIDGETS_DIALOG, "Sample Widget 2",
            "[Widget Sidebar] Displays information we searched for");

        browser.expect.element(MainPage.WIDGETS_DIALOG).text.to.not.contain("Sample Widget 1");


        browser.closeWindow().end();
    }

};
