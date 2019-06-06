import { NightwatchAPI } from "nightwatch";

import { MainPage } from "./selectors";

import { loggedInAs } from "./helpers";

module.exports = {
    "As a user, I can see the classification banner": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.CLASSIFICATION_BANNER, 2000, "[Classification Banner] is visible");

        browser.closeWindow().end();
    },
    "As an Admin, I can see the Admin User Menu Option": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser
            .waitForElementVisible(MainPage.USER_MENU_BUTTON, 4000, "[Main Page] User Menu button is visible.")
            .click(MainPage.USER_MENU_BUTTON);

        browser.waitForElementVisible(
            MainPage.ADMINISTRATION_BUTTON,
            2000,
            "[Main Page] Administration button is visible."
        );

        browser.closeWindow().end();
    },
    "As a User, I cannot see the Admin User Menu Option": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testUser1", "password", "Test User 1");

        browser
            .waitForElementVisible(MainPage.USER_MENU_BUTTON, 4000, "[Main Page] User Menu button is visible.")
            .click(MainPage.USER_MENU_BUTTON);

        browser.waitForElementNotPresent(
            MainPage.ADMINISTRATION_BUTTON,
            3000,
            "[Main Page] Administration button is not present."
        );

        browser.closeWindow().end();
    }
};
