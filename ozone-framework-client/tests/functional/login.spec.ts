import { NightwatchAPI } from "nightwatch";

import { LoginForm, MainPage } from "./selectors";


export default {

    "Login as 'testAdmin1'": (browser: NightwatchAPI) => {
        const username = "testAdmin1";
        const password = "password";
        const displayName = "Test Administrator 1";

        browser.url("http://localhost:3000")
               .waitForElementVisible("body", 1000, "[Home Page] is visible")
               .waitForElementVisible(MainPage.WARNING_DIALOG, 1000, "[Warning Dialog] is visible");

        browser.click(MainPage.ACCEPT_BUTTON)
               .waitForElementVisible(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is visible");

        browser.setValue(LoginForm.USER_NAME_FIELD, username)
               .setValue(LoginForm.PASSWORD_FIELD, password)
               .click(LoginForm.SUBMIT_BUTTON)
               .waitForElementNotPresent(MainPage.WARNING_DIALOG, 1000, "[Warning Dialog] is closed")
               .waitForElementNotPresent(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is closed");

        browser.assert.containsText(MainPage.USER_MENU_BUTTON, displayName, `[User Menu] Button text is equal to "${displayName}"`);

        browser.click(MainPage.USER_MENU_BUTTON)
               .waitForElementVisible(MainPage.LOGOUT_BUTTON, 1000, "[Logout Button] is visible");

        browser.click(MainPage.LOGOUT_BUTTON)
               .waitForElementVisible(MainPage.WARNING_DIALOG, 1000, "[Warning Dialog] is visible");

        browser.closeWindow().end();
    }

};
