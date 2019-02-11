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

    browser.click(MainPage.USER_MENU_BUTTON)
      .waitForElementVisible(MainPage.ADMINISTRATION_BUTTON, 2000, "[Administration Button] is visible");

    browser.click(MainPage.ADMINISTRATION_BUTTON)
      .waitForElementVisible(MainPage.ADMINISTRATION_MENU, 2000, "[Administration Menu] is visible");

    browser.click(MainPage.USER_MENU_ADMIN_BUTTON)
      .waitForElementVisible(MainPage.USER_ADMINISTRATION_WIDGET, 2000, "[User Administration Widget] is visible");

      browser.click(MainPage.USER_MENU_BUTTON)
        .waitForElementVisible(MainPage.ADMINISTRATION_BUTTON, 2000, "[Administration Button] is visible");

      browser.click(MainPage.ADMINISTRATION_BUTTON)
        .waitForElementVisible(MainPage.ADMINISTRATION_MENU, 2000, "[Administration Menu] is visible");

    browser.click(MainPage.GROUPS_ADMIN_BUTTON)
      .waitForElementVisible(MainPage.GROUPS_ADMIN_WIDGET, 2000, "[Groups Administration Widget] is visible");

}
