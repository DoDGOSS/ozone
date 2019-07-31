import { NightwatchAPI } from "nightwatch";

import { GlobalElements, MainPage } from "./selectors";

import { loggedInAs } from "./helpers";
import { log } from "util";

module.exports = {
    "As an Administrator, I can view the widget sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser
            .click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible");

        browser.closeWindow().end();
    },

    "As an Administrator, I can search the widget sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

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
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser
            .click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible");

        browser.click(MainPage.WIDGETS_SORT);

        browser.closeWindow().end();
    },

    "As an Administrator, I can delete a widget from the sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser
            .click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible.");

        browser.getText(`${MainPage.WIDGETS_DIALOG} ul > li:nth-child(1) > div`, (result) => {
            const widgetNameToDelete = result.value;
            log("We will be deleting the Widget identified as: " + widgetNameToDelete);

            browser
                .moveToElement(`${MainPage.WIDGETS_DIALOG} ul > li:nth-child(1) > div`, 0, 0)
                .click(`${MainPage.WIDGETS_DIALOG} ul > li:nth-child(1) > div ${MainPage.WIDGET_DELETE_BUTTON}`)
                .waitForElementVisible(
                    GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                    1500,
                    "[Confirmation Dialog] is visible."
                );

            browser
                .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
                .waitForElementNotPresent(
                    GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                    1500,
                    "[Confirmation Dialog] is not visible."
                );

            browser
                .click(MainPage.WIDGETS_BUTTON)
                .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible.");

            browser.expect.element(MainPage.WIDGETS_DIALOG).text.to.not.contain(widgetNameToDelete);
        });

        browser.closeWindow().end();
    },

    "As a User, I can delete a widget from the sidebar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testUser1", "password", "Test User 1");

        browser
            .click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible.");

        browser.getText(`${MainPage.WIDGETS_DIALOG} ul > li:nth-child(1) > div`, (result) => {
            const widgetNameToDelete = result.value;
            log("We will be deleting the Widget identified as: " + widgetNameToDelete);

            browser
                .moveToElement(`${MainPage.WIDGETS_DIALOG} ul > li:nth-child(1) > div`, 0, 0)
                .click(`${MainPage.WIDGETS_DIALOG} ul > li:nth-child(1) > div ${MainPage.WIDGET_DELETE_BUTTON}`)
                .waitForElementVisible(
                    GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                    1500,
                    "[Confirmation Dialog] is visible."
                );

            browser
                .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
                .waitForElementNotPresent(
                    GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                    1500,
                    "[Confirmation Dialog] is not visible."
                );

            browser
                .click(MainPage.WIDGETS_BUTTON)
                .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1500, "[Widget Sidebar] is visible.");

            browser.expect.element(MainPage.WIDGETS_DIALOG).text.to.not.contain(widgetNameToDelete);
        });

        browser.closeWindow().end();
    }
};
