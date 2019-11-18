import { NightwatchAPI } from "nightwatch";

import { GlobalElements, MainPage, StackDialog } from "./selectors";

import { loggedInAs } from "./helpers";

module.exports = {
    "As a user, I want to be able to create a new Stack": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

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
            .waitForElementNotPresent(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Dialog] is closed.");

        browser.closeWindow().end();
    },

    //    Edit
    "As an administrator, I can edit a stack": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(
                StackDialog.getEditButtonForStack(StackDialog.CreateStack.CREATE_STACK_NAME),
                2000,
                "[Stacks Dialog] is visible."
            );

        browser.click(StackDialog.getEditButtonForStack(StackDialog.CreateStack.CREATE_STACK_NAME));

        browser.waitForElementVisible(StackDialog.CreateStack.NAME_FIELD, 2000, "[Edit Stack Dialog] is visible.");

        browser.clearValue(StackDialog.CreateStack.NAME_FIELD);

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackDialog.CreateStack.EDIT_STACK_NAME);

        browser.click(StackDialog.CreateStack.SUBMIT);

        browser.waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser.pause(500);

        browser.assert.containsText(
            StackDialog.STACK_DIALOG,
            StackDialog.CreateStack.EDIT_STACK_NAME,
            "[Stack Dialog] Stack successfully edited."
        );

        browser.closeWindow().end();
    },

    //    Share with confirmation
    "As an administrator, I can share a stack": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser
            .pause(500)
            .click(StackDialog.getShareButtonForStack(StackDialog.CreateStack.EDIT_STACK_NAME))
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present."
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present."
            );

        browser.closeWindow().end();
    },

    //    Add a Dashboard to a Stack
    "As an administrator, I can add a Dashboard to a Stack": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");
        console.log(StackDialog.CreateStack.SUBMIT);
        browser
            .pause(1000)
            .click(StackDialog.getAddDashboardButtonForStack(StackDialog.CreateStack.EDIT_STACK_NAME))
            .waitForElementVisible(
                StackDialog.CreateStack.SUBMIT,
                2000,
                "[Create Dashboard Submit Button] is visible."
            );

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackDialog.CreateStack.CREATE_DASHBOARD_NAME);

        browser
            .click(StackDialog.SUBMIT_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser.pause(500);

        browser.assert.containsText(
            StackDialog.STACK_DIALOG,
            StackDialog.CreateStack.CREATE_DASHBOARD_NAME,
            "[Stack Dialog] Dashboard successfully added."
        );

        browser.closeWindow().end();
    },

    //    Add a Dashboard to a Stack and Copy Layout
    "As an administrator, I can add a Dashboard to a Stack with a Copied Layout": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser
            .pause(500)
            .click(StackDialog.getAddDashboardButtonForStack(StackDialog.CreateStack.EDIT_STACK_NAME))
            .waitForElementVisible(
                StackDialog.CreateStack.SUBMIT,
                2000,
                "[Create Dashboard Submit Button] is visible."
            );

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackDialog.CreateStack.COPY_DASHBOARD_NAME);

        browser.click(StackDialog.CreateStack.COPY);
        browser.click(StackDialog.CreateStack.COPY_DROPDOWN);
        browser.click(StackDialog.CreateStack.FIRST_DASHBOARD);

        browser
            .click(StackDialog.SUBMIT_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser.pause(500);

        browser.assert.containsText(
            StackDialog.STACK_DIALOG,
            StackDialog.CreateStack.CREATE_DASHBOARD_NAME,
            "[Stack Dialog] Dashboard successfully added."
        );

        browser.closeWindow().end();
    },

    //    Edit Dashboard
    "As an administrator, I can edit a dashboard in a stack": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser
            .pause(1000)
            .click(StackDialog.CreateStack.DROPDOWN_CARET)
            .waitForElementVisible(
                StackDialog.getEditButtonForDashboard(StackDialog.CreateStack.CREATE_DASHBOARD_NAME),
                2000,
                "[Stack Dialog] Edit Button for Dashboard is visible."
            )
            .click(StackDialog.getEditButtonForDashboard(StackDialog.CreateStack.CREATE_DASHBOARD_NAME));

        browser
            .waitForElementVisible(StackDialog.CreateStack.NAME_FIELD, 2000, "[Dashboard Edit Dialog] is visible.")
            .clearValue(StackDialog.CreateStack.NAME_FIELD);

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackDialog.CreateStack.EDIT_DASHBOARD_NAME);

        browser.click(StackDialog.CreateStack.SUBMIT);

        browser
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.")
            .pause(500)
            .click(StackDialog.CreateStack.DROPDOWN_CARET);

        browser.assert.containsText(
            StackDialog.STACK_DIALOG,
            StackDialog.CreateStack.EDIT_DASHBOARD_NAME,
            "[Stack Dialog] Dashboard successfully edited."
        );

        browser.closeWindow().end();
    },

    //    Delete Dashboard with confirmation
    "As an administrator, I can delete a dashboard from a stack": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        browser
            .pause(500)
            .click(StackDialog.CreateStack.DROPDOWN_CARET)
            .waitForElementVisible(
                StackDialog.getEditButtonForDashboard(StackDialog.CreateStack.EDIT_DASHBOARD_NAME),
                2000,
                "[Stack Dialog] Edit Button for Dashboard is visible."
            );

        browser
            .click(StackDialog.getDeleteButtonForDashboard(StackDialog.CreateStack.EDIT_DASHBOARD_NAME))
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present."
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present."
            );

        browser.expect
            .element(StackDialog.STACK_DIALOG)
            .text.to.not.contain(StackDialog.CreateStack.EDIT_DASHBOARD_NAME);

        browser.closeWindow().end();
    },

    //    Delete Stack with confirmation
    "As an administrator, I can delete a stack": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(
                StackDialog.getDeleteButtonForStack(StackDialog.CreateStack.EDIT_STACK_NAME),
                2000,
                "[Stack Dialog] is visible."
            );

        browser
            .pause(500)
            .click(StackDialog.getDeleteButtonForStack(StackDialog.CreateStack.EDIT_STACK_NAME))
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present."
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present."
            );

        browser.expect.element(StackDialog.STACK_DIALOG).text.to.not.contain(StackDialog.CreateStack.EDIT_STACK_NAME);

        browser.closeWindow().end();
    },

    // document title changes
    "As a user, the browser's tab title should reflect the name of the current dashboard": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.getTitle(function(title) {
            if (title)
                this.assert.notEqual(
                    title,
                    StackDialog.CreateStack.CREATE_STACK_NAME,
                    `[Browser Title] is not ${StackDialog.CreateStack.CREATE_STACK_NAME}`
                );
        });

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

        browser.getTitle(function(title) {
            if (title)
                this.assert.equal(
                    title,
                    StackDialog.CreateStack.CREATE_STACK_NAME,
                    `[Browser Title] is Untitled ${StackDialog.CreateStack.CREATE_STACK_NAME}`
                );
        });

        browser.closeWindow().end();
    }
};
