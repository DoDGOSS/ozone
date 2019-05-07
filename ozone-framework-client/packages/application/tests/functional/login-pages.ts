import { NightwatchAPI } from "./nightwatch";

import { PageObject } from "./PageObject";
import { MainPage } from "./pages";

export class Application extends PageObject {
    static Selector = "#root";

    constructor(browser: NightwatchAPI) {
        super(browser, Application.Selector, "Application");

        browser.url("http://localhost:3000");
    }

    waitForConsentPage(): ConsentPage {
        return new ConsentPage(this.browser).waitUntilVisible();
    }
}

export class ConsentPage extends PageObject {
    static Selector = `div[data-test-id="consent-notice"]`;

    static UserAgreementLink = `div[data-test-id="consent-notice"] a`;
    static AcceptButton = `div[data-test-role="dialog-actions"] a[role="button"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, ConsentPage.Selector, "Consent Page");
    }

    openUserAgreement(): UserAgreement {
        this.browser.click(ConsentPage.UserAgreementLink);
        this.waitUntilNotPresent();
        return new UserAgreement(this.browser).waitUntilVisible();
    }

    clickAcceptButton(): LoginPage {
        this.browser.click(ConsentPage.AcceptButton);
        this.waitUntilNotPresent();
        return new LoginPage(this.browser).waitUntilVisible();
    }
}

export class UserAgreement extends PageObject {
    static Selector = `div[data-test-id="user-agreement"]`;

    static BackButton = `button[data-test-id="user-agreement-back-button"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, UserAgreement.Selector, "User Agreement");
    }

    clickBackButton(): ConsentPage {
        this.browser.click(UserAgreement.BackButton);
        this.waitUntilNotPresent();
        return new ConsentPage(this.browser).waitUntilVisible();
    }
}

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

    clickSubmitButton(): MainPage {
        this.browser.click(LoginPage.SubmitButton);
        this.waitUntilNotPresent();
        return new MainPage(this.browser).waitUntilVisible();
    }
}
