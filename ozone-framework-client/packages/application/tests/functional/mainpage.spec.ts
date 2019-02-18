import { NightwatchAPI } from "nightwatch";

import { MainPage } from "./selectors";

import { loggedInAs } from "./helpers";


module.exports = {

    "As a user, I can see the classification banner": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.CLASSIFICATION_BANNER, 1000, "[Classification Banner] is visible");

        browser.closeWindow().end();
    }

};
