import { NightwatchAPI } from "nightwatch";

import { MainPage } from "./selectors";

import { loggedInAs } from "./helpers";

module.exports = {
    "As an admin, I can see files in the help folder": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser
            .waitForElementVisible(MainPage.HELP_BUTTON, 3000, "[Help Dialog Button] is visible.")
            .click(MainPage.HELP_BUTTON);

        browser.waitForElementVisible(MainPage.HELP_DIALOG, 2000, "[Help Dialog Box] is visible.");
        browser.waitForElementVisible(MainPage.HELP_SAMPLE_FILE, 8000, "[Help Sample File] is visible.");

        browser.closeWindow().end();
    }
};
