import { NightwatchAPI } from "nightwatch";

import { MainPage, StackDialog } from "./selectors";

import { loggedInAs } from "./helpers";

module.exports = {
    "As a user, I can see the classification banner": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.CLASSIFICATION_BANNER, 2000, "[Classification Banner] is visible");

        browser.closeWindow().end();
    },
    "As an Admin, I can see the Admin User Menu Option": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser
            .waitForElementVisible(MainPage.USER_MENU_BUTTON, 4000, "[Main Page] User Menu button is visible.")
            .click(MainPage.USER_MENU_BUTTON);

        browser.waitForElementVisible(
            MainPage.ADMINISTRATION_BUTTON,
            2000,
            "[Main Page] Administration button is visible."
        );

        browser.closeWindow().end();
    },
    "As a User, I cannot see the Admin User Menu Option": (browser: NightwatchAPI) => {
        loggedInAs(browser, "user", "password", "Test User 1");

        browser
            .waitForElementVisible(MainPage.USER_MENU_BUTTON, 4000, "[Main Page] User Menu button is visible.")
            .click(MainPage.USER_MENU_BUTTON);

        browser.waitForElementNotPresent(
            MainPage.ADMINISTRATION_BUTTON,
            3000,
            "[Main Page] Administration button is not present."
        );

        browser.closeWindow().end();
    },
    "As a User, I should see my last selected dashboard as the initial dashboard that loads": (
        browser: NightwatchAPI
    ) => {
        loggedInAs(browser, "user", "password", "Test User 1");

        //TODO: create a way to select a stack/dashboard from the list. The tree will need to be updated to include some attribute for the stack/dashboard that we can query against.
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");
        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible.");
        browser
            .click(StackDialog.CREATE_STACK_BUTTON)
            .waitForElementVisible(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Submit Button] is visible.");

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackDialog.CreateStack.CREATE_STACK_NAME);

        browser
            .click(StackDialog.CreateStack.SUBMIT)
            .waitForElementNotPresent(StackDialog.CreateStack.SUBMIT, 1000, "[Create Stack Dialog] is closed.");
        browser.click("save-dashboard");

        browser.refresh();
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");
        browser.getTitle(function(title) {
            if (title)
                this.assert.equal(
                    title,
                    `Ozone - ${StackDialog.CreateStack.CREATE_STACK_NAME} (default)`,
                    "[Dashboard] is last selected dashboard."
                );
        });
    }
};
