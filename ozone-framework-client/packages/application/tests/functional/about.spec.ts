import { NightwatchAPI } from "nightwatch";

import { MainPage } from "./selectors";

import { loggedInAs } from "./helpers";

module.exports = {
    "As a user, I can open the about dialog": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser
            .click(MainPage.USER_MENU_BUTTON)
            .waitForElementVisible(MainPage.USER_MENU, 1000, "[User Menu] is visible");

        browser
            .click(MainPage.ABOUT_BUTTON)
            .waitForElementVisible(MainPage.ABOUT_DIALOG, 1000, "[About Dialog] is visible");

        browser.closeWindow().end();
    }
};
