module.exports = {

    "Login as 'testAdmin1'": (browser) => {

        let mainPage = loadHomePage(browser);

        mainPage.openLoginDialog()
            .typeUsername("testAdmin1")
            .typePassword("password")
            .submit()
            .verifySuccessCallout();

        mainPage.getUserMenu()
            .assertContainsText("Test Administrator 1");

        browser.end();
    }

};


function loadHomePage(browser) {
    browser
        .url("http://localhost:3000")
        .waitForElementVisible(
            "body", 1000,
            "[Home Page] is visible");

    return new MainPage(browser);
}

class MainPage {

    constructor(browser) {
        this.browser = browser;
    }

    openLoginDialog() {
        this.browser
            .click("button[data-element-id='login-button']")
            .waitForElementVisible(
                "div[data-element-id='login-dialog']", 1000,
                "[Login Dialog] is visible");

        return new LoginDialog(this.browser);
    }

    getUserMenu() {
        return new UserMenu(this.browser);
    }

}

class UserMenu {

    constructor(browser) {
        this.browser = browser;
    }

    assertContainsText(text) {
        this.browser.assert.containsText(
            "button[data-element-id='user-menu-button']", text,
            `[User Menu] Button text is equal to "${text}"`)
    }

}

class LoginDialog {

    constructor(browser) {
        this.browser = browser;
    }

    typeUsername(username) {
        this.browser.setValue("input[data-element-id='form-field-username']", username);
        return this;
    }

    typePassword(password) {
        this.browser.setValue("input[data-element-id='form-field-password']", password);
        return this;
    }

    submit() {
        this.browser.click("button[data-element-id='form-submit-button']");
        return this;
    }

    verifySuccessCallout() {
        this.browser.waitForElementVisible(
            "div[data-element-id='form-success-callout']", 1000,
            "[Login Dialog] Success callout is visible"
        );
        return this;
    }

}
