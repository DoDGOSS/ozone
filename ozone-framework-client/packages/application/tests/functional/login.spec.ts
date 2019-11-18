import { NightwatchAPI } from "nightwatch";

import { Application } from "./pages";

module.exports = {
    "Login as 'admin'": (browser: NightwatchAPI) => {
        const username = "admin";
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
