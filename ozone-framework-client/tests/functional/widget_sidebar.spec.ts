import { NightwatchAPI } from "nightwatch";

import { MainPage } from "./selectors";

import { loggedInAs } from "./helpers";


export default {

    "As an Administrator, I can use the admin toolbar": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        
        browser.click(MainPage.WIDGETS_BUTTON)
            .waitForElementVisible(MainPage.WIDGETS_DIALOG, 1000, "[Widget Sidebar] is visible");

        browser.closeWindow().end();

    }

};
