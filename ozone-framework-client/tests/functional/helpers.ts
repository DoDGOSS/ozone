import {LoginForm, MainPage} from "./selectors";
import {NightwatchAPI} from "./nightwatch";


export function loggedInAs(browser: NightwatchAPI, username: string, password: string, displayName: string) {
    browser.url("http://localhost:3000")
    .waitForElementVisible("body", 1000, "[Home Page] is visible")
    .waitForElementVisible(MainPage.WARNING_DIALOG, 2000, "[Warning Dialog] is visible");

    browser.click(MainPage.ACCEPT_BUTTON)
           .waitForElementVisible(MainPage.LOGIN_DIALOG, 2000, "[Login Dialog] is not visible");

    browser.setValue(LoginForm.USER_NAME_FIELD, username)
           .setValue(LoginForm.PASSWORD_FIELD, password)
           .click(LoginForm.SUBMIT_BUTTON)
           .pause(250)
           .waitForElementNotPresent(MainPage.WARNING_DIALOG, 2000, "[Warning Dialog] is closed")
           .waitForElementNotPresent(MainPage.LOGIN_DIALOG, 2000, "[Login Dialog] is closed");

    browser.assert.containsText(MainPage.USER_MENU_BUTTON, displayName, `[User Menu] Button text is equal to "${displayName}"`);

    // Refresh browser temporarily to view the users in the user admin widget
    browser.refresh();
}
