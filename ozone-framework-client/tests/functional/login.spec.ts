import { NightwatchAPI } from "nightwatch";

import { LoginForm, MainPage } from "./selectors";


export default {

    "Login as 'testAdmin1'": (browser: NightwatchAPI) => {
        const username = "testAdmin1";
        const password = "password";
        const displayName = "Test Administrator 1";

        browser.url("http://localhost:3000")
               .waitForElementVisible("body", 1000, "[Home Page] is visible");

        browser.click(MainPage.LOGIN_BUTTON)
               .waitForElementVisible(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is visible");

        browser.setValue(LoginForm.USER_NAME_FIELD, username)
               .setValue(LoginForm.PASSWORD_FIELD, password)
               .click(LoginForm.SUBMIT_BUTTON)
               .waitForElementVisible(LoginForm.SUCCESS_CALLOUT, 1000, "[Login Dialog] Success callout is visible");

        browser.assert.containsText(MainPage.USER_MENU_BUTTON, displayName, `[User Menu] Button text is equal to "${displayName}"`);

        browser.closeWindow().end();
    }

};

