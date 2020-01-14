import { NightwatchAPI } from "nightwatch";
import { MainPage } from "./selectors";
import { loggedInAs } from "./helpers";

module.exports = {
    "As an Administrator, I can view the widget sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser
            .click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible");

        browser.closeWindow().end();
    },

    "As an Administrator, I can search the widget sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser
            .click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible");

        browser.clearValue(MainPage.WIDGETS_SEARCH).setValue(MainPage.WIDGETS_SEARCH, "Channel Listener");

        browser.assert.containsText(
            MainPage.WIDGETS_DIALOG,
            "Channel Listener",
            "[Widget Sidebar] Displays information we searched for"
        );

        browser.expect.element(MainPage.WIDGETS_DIALOG).text.to.not.contain("Channel Shouter");

        browser.closeWindow().end();
    },

    "As an Administrator, I can toggle ascending and descending": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser
            .click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible");

        browser.click(MainPage.WIDGETS_SORT);

        browser.closeWindow().end();
    }
};
