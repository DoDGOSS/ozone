import { NightwatchAPI } from "nightwatch";

import { LoginForm, MainPage, AdminWidgets } from "./selectors";


export default {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an administrator view all users in admin widget": (browser: NightwatchAPI) => {
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

        browser.assert.containsText(MainPage.USER_MENU_BUTTON,
            displayName, `[User Menu] Button text is equal to "${displayName}"`);

        // Refresh browser temporarily to view the users in the user admin widget
        browser.refresh();

        // browser.pause(1000);

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            'Users', "[User Admin Widget] is visible");

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            'Test Administrator 1', "[User Admin Widget] Displays user information");

        browser.closeWindow().end();
    },
    "As an administrator I want to create a new user": (browser: NightwatchAPI) => {
        const username = "testAdmin1";
        const password = "password";
        const displayName = "Test Administrator 1";

        const newDisplayName = "New User Test";
        const newUserName = "newUser1"
        const newUserEmail = "newUserEmail1@email.com";


        browser.url("http://localhost:3000")
            .waitForElementVisible("body", 1000, "[Home Page] is visible");

        browser.click(MainPage.LOGIN_BUTTON)
            .waitForElementVisible(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is visible");

        browser.setValue(LoginForm.USER_NAME_FIELD, username)
            .setValue(LoginForm.PASSWORD_FIELD, password)
            .click(LoginForm.SUBMIT_BUTTON)
            .waitForElementVisible(LoginForm.SUCCESS_CALLOUT,
                1000, "[Login Dialog] Success callout is visible");

        browser.assert.containsText(MainPage.USER_MENU_BUTTON,
            displayName, `[User Menu] Button text is equal to "${displayName}"`);

        // Refresh browser temporarily to view the users in the user admin widget
        browser.refresh();

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            'Users', "[User Admin Widget] is visible");

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            'Test Administrator 1',
            "[User Admin Widget] Displays user information");

        browser.click(AdminWidgets.USER_ADMIN_CREATE_BUTTON);

        browser.pause(1000);

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            'Username', "[User Admin Create Form] is visible");

        browser.setValue(AdminWidgets.USER_NAME_FIELD, newUserName)
                .setValue(AdminWidgets.FULL_NAME_FIELD, newDisplayName)
                .setValue(AdminWidgets.EMAIL_FIELD, newUserEmail)

        browser.click(AdminWidgets.SUBMIT_BUTTON)
            browser.pause(1000)
            .waitForElementVisible(AdminWidgets.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible")

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            newDisplayName, "[User Admin Widget] New user successfully created");

        browser.closeWindow().end();
    },
    "As an administrator I want to delete a user": (browser: NightwatchAPI) => {
        const username = "testAdmin1";
        const password = "password";
        const displayName = "Test Administrator 1";

        const newUserEmail = "newUserEmail1@email.com";


        browser.url("http://localhost:3000")
            .waitForElementVisible("body", 1000, "[Home Page] is visible");

        browser.click(MainPage.LOGIN_BUTTON)
            .waitForElementVisible(MainPage.LOGIN_DIALOG, 1000, "[Login Dialog] is visible");

        browser.setValue(LoginForm.USER_NAME_FIELD, username)
            .setValue(LoginForm.PASSWORD_FIELD, password)
            .click(LoginForm.SUBMIT_BUTTON)
            .waitForElementVisible(LoginForm.SUCCESS_CALLOUT,
                1000, "[Login Dialog] Success callout is visible");

        browser.assert.containsText(MainPage.USER_MENU_BUTTON,
            displayName, `[User Menu] Button text is equal to "${displayName}"`);

        // Refresh browser temporarily to view the users in the user admin widget
        browser.refresh();

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            'Users', "[User Admin Widget] is visible");

        browser.assert.containsText(AdminWidgets.USER_ADMIN_WIDGET_DIALOG,
            newUserEmail,
            "[User Admin Widget] Displays user information we wish to delete");

        browser.click(AdminWidgets.DELETE_USER_ID);

        browser.waitForElementVisible(AdminWidgets.CONFIRM_DELETE_ALERT)
               .click(AdminWidgets.CONFIRM_DELETE_BUTTON);

        browser.waitForElementVisible(AdminWidgets.USER_ADMIN_WIDGET_DIALOG, 2000, "[User Admin Widget] is visible");

        browser.expect.element(AdminWidgets.USER_ADMIN_WIDGET_DIALOG).text.to.not.contain(newUserEmail);

        browser.closeWindow().end();
    }


};

