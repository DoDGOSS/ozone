import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { HomeScreen } from "./HomeScreen";

export class LoginPage extends PageObject {
    static Selector = `div[data-test-id="login-dialog"]`;

    static UsernameField = `input[data-role="field"][name="username"]`;
    static PasswordField = `input[data-role="field"][name="password"]`;
    static SubmitButton = `button[data-element-id="form-submit-button"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, LoginPage.Selector, "Login Page");
    }

    enterUsername(username: string): this {
        this.browser.setValue(LoginPage.UsernameField, username);
        return this;
    }

    enterPassword(password: string): this {
        this.browser.setValue(LoginPage.PasswordField, password);
        return this;
    }

    clickSubmitButton(): HomeScreen {
        this.clickWhenVisible(LoginPage.SubmitButton, "Submit button");
        this.waitUntilNotPresent();
        return this.open(HomeScreen).waitUntilVisible(5000);
    }
}
