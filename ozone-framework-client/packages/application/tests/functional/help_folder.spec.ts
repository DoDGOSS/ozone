import { NightwatchAPI } from "nightwatch";

import { MainPage } from "./selectors";

import { loggedInAs } from "./helpers";

module.exports = {
    "As a user, I can see files in the help folder": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser
            .waitForElementVisible(MainPage.HELP_DIALOG, 2000, "[Help Dialog Button] is visible.")
            .click(MainPage.HELP_DIALOG);

        browser.waitForElementVisible(MainPage.HELP_DIALOG_BOX, 2000, "[HELP DIALOG BOX] is visible.");
        browser.waitForElementVisible(MainPage.HELP_SAMPLE_FILE, 8000, "[HELP Sample File] is visible.");

        browser.closeWindow().end();
    }
};
