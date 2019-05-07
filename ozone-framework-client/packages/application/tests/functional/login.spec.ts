import { NightwatchAPI } from "nightwatch";

import { Application } from "./login-pages";

module.exports = {
    "Login as 'testAdmin1'": (browser: NightwatchAPI) => {
        const username = "testAdmin1";
        const password = "password";

        new Application(browser)
            .waitForConsentPage()
            .openUserAgreement()
            .clickBackButton()
            .clickAcceptButton()
            .enterUsername(username)
            .enterPassword(password)
            .clickSubmitButton();

        browser.closeWindow().end();
    }
};
