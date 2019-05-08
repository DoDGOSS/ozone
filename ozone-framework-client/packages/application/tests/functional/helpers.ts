import { NightwatchAPI } from "./nightwatch";

import { Application } from "./pages";

export function loggedInAs(browser: NightwatchAPI, username: string, password: string, displayName: string) {
    new Application(browser)
        .waitForConsentPage()
        .clickAcceptButton()
        .enterUsername(username)
        .enterPassword(password)
        .clickSubmitButton();
}
