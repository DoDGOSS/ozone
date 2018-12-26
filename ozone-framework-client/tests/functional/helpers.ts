import {LoginForm, MainPage} from "./selectors";
import {NightwatchAPI} from "./nightwatch";


export function loggedInAs(browser: NightwatchAPI, username: string, password: string, displayName: string) {
        browser.url("http://localhost:3000")
        .waitForElementVisible("body", 1000, "[Home Page] is visible");

    browser.click(MainPage.LOGIN_BUTTON)
        .waitForElementVisible(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is visible");

    browser.setValue(LoginForm.USER_NAME_FIELD, username)
           .setValue(LoginForm.PASSWORD_FIELD, password)
           .click(LoginForm.SUBMIT_BUTTON)
           .waitForElementNotPresent(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is closed");

    browser.assert.containsText(MainPage.USER_MENU_BUTTON, displayName, `[User Menu] Button text is equal to "${displayName}"`);

    // Refresh browser temporarily to view the users in the user admin widget
    browser.refresh();
}
