import { NightwatchAPI } from "nightwatch";

import { GlobalElements, MainPage, StackDialog, StackAdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";

import { StackAdmin } from "./pages";

module.exports = {
    "As an Administrator, I can restore a shared Dashboard": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");
        // Create Stack
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible.");

        browser
            .click(StackDialog.CREATE_STACK_BUTTON)
            .waitForElementVisible(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Submit Button] is visible.");

        browser.pause(1000);

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME);

        browser.click(StackDialog.CreateStack.SELECT_PREMADE_LAYOUT);

        browser.click(StackDialog.CreateStack.QUAD);

        browser
            .click(StackDialog.CreateStack.SUBMIT)
            .waitForElementNotPresent(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Dialog] is closed.");

        // Create a Dashboard
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.DIALOG_CLOSE)
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.")
            .waitForElementVisible(
                StackDialog.getAddDashboardButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
                2000,
                "[Stack Dialog] Add dashboard button is visible"
            );

        browser
            .click(StackDialog.getAddDashboardButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME))
            .pause(500)
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

        // restore unshared Dashboard not possible
        browser.waitForElementVisible(
            StackDialog.getRestoreButtonForDashboard(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT),
            2000,
            "[Stack Dialog] restore button is visible."
        );

        browser
            .click(StackDialog.getRestoreButtonForDashboard(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT))
            .waitForElementVisible(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                2000,
                "[Confirmation Dialog] is visible"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(GlobalElements.SPINNER)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");
        // restore unshared Stack not possible
        browser.waitForElementVisible(
            StackDialog.getRestoreButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Dialog] restore button is visible."
        );

        browser
            .click(StackDialog.getRestoreButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME))
            .waitForElementVisible(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                2000,
                "[Confirmation Dialog] is visible"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");

        // We need to share the Stack to allow us to add users
        browser.waitForElementVisible(
            StackDialog.getShareButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Dialog] share button is visible."
        );

        browser
            .click(StackDialog.getShareButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME))
            .pause(1000)
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .pause(500)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.waitForElementVisible(
            StackAdminWidget.DASHBOARD_DIALOG_CLOSE,
            2000,
            "[Stack Dialog] is safe to close."
        );

        browser.click(StackAdminWidget.DASHBOARD_DIALOG_CLOSE);

        // Now that the dashboard is shared, we should be able to add users
        StackAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Admin Widget Edit Button] is visible."
        );

        browser.click(StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME));

        browser.waitForElementVisible(StackAdminWidget.USERS_TAB, 2000, "[Stack Admin Widget Users Tab] is visible.");

        browser.click(StackAdminWidget.USERS_TAB);

        browser.waitForElementVisible(
            StackAdminWidget.ADD_USER_BUTTON,
            2000,
            "[Stack Admin Widget Users Tab] add button is visible."
        );

        browser.getAttribute(StackAdminWidget.ADD_USER_BUTTON, "enabled", function(result) {
            this.assert.equal(result.value, null, "[Stack Admin Widget Users Tab] add button is enabled.");
        });

        browser.click(StackAdminWidget.ADD_USER_BUTTON).waitForElementNotPresent(GlobalElements.SPINNER);

        browser.waitForElementVisible(
            GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG,
            2000,
            "[Add User Dialog] is visible."
        );

        browser.waitForElementVisible(
            StackAdminWidget.ROW_BOX,
            2000,
            "[Add User Dialog] rows are available for adding."
        );

        browser.waitForElementVisible(
            StackAdminWidget.FIRST_ROW,
            2000,
            "[Add User Dialog] first user is present to select."
        );

        browser.click(StackAdminWidget.FIRST_ROW);

        browser.click(StackAdminWidget.SECOND_ROW);

        browser.click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON);

        browser.waitForElementVisible(
            StackAdminWidget.BACK_BUTTON,
            2000,
            "[Stack Admin Widget Users Tab] Back button is visible."
        );

        browser.click(StackAdminWidget.BACK_BUTTON);

        browser.click(MainPage.USER_MENU_BUTTON);

        browser.click(MainPage.LOGOUT_BUTTON).pause(500);

        browser.closeWindow().end();
    },
    "As a User, I can restore a shared Stack": (browser: NightwatchAPI) => {
        // Login as testUser
        loggedInAs(browser, "user", "password", "Test User 1");

        // Load Stack

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible.")
            .waitForElementNotPresent(GlobalElements.SPINNER);

        browser.waitForElementVisible(
            StackDialog.getActionButtonsForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Dialog] Stack is visible."
        );
        browser
            .waitForElementVisible(StackDialog.STACK_LIST, 2000, "[Stack list] is visible")
            .waitForElementVisible(
                StackDialog.getActionButtonsForDashboard(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT),
                2000,
                "[Stack Dialog] Dashboards are visible."
            );

        browser.moveToElement(StackDialog.DASHBOARD, 0, 0);
        browser.doubleClick();

        // add widget frames to stacks
        browser
            .waitForElementVisible(MainPage.ADD_LAYOUT, 2000, "[Add Panel Button] is visible.")
            .click(MainPage.ADD_LAYOUT);

        browser
            .waitForElementVisible(MainPage.TABBED_LAYOUT_BUTTON, 2000, "[Tabbed Layout Button] is visible.")
            .click(MainPage.TABBED_LAYOUT_BUTTON)
            .waitForElementVisible(MainPage.TABBED_PANEL, 2000, "[Tabbed Panel] is visible.");
        // restore stack
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");
        browser.waitForElementVisible(
            StackDialog.getActionButtonsForDashboard(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT),
            2000,
            "[Dashboards] are visible."
        );
        browser.waitForElementVisible(
            StackDialog.getRestoreButtonForDashboard(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT),
            2000,
            "[Stack Dialog] restore button is visible."
        );

        browser
            .click(StackDialog.getRestoreButtonForDashboard(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT))
            .waitForElementVisible(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                2000,
                "[Confirmation Dialog] is visible"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(MainPage.TABBED_PANEL);
        // Load Stack

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible.");

        browser.waitForElementVisible(
            StackDialog.getActionButtonsForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Dialog] Stack is visible."
        );
        browser.waitForElementVisible(
            StackDialog.getActionButtonsForDashboard(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT),
            2000,
            "[Stack Dialog] Dashboards are visible."
        );

        browser.moveToElement(StackDialog.DASHBOARD, 0, 0);
        browser.doubleClick();
        // add widget frames to stacks
        browser
            .waitForElementVisible(MainPage.ADD_LAYOUT, 2000, "[Add Panel Button] is visible.")
            .click(MainPage.ADD_LAYOUT);

        browser
            .waitForElementVisible(MainPage.TABBED_LAYOUT_BUTTON, 2000, "[Tabbed Layout Button] is visible.")
            .click(MainPage.TABBED_LAYOUT_BUTTON)
            .waitForElementVisible(MainPage.TABBED_PANEL, 2000, "[Tabbed Panel] is visible.");
        // restore stack
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Stack Dialog] is visible.");
        browser.waitForElementVisible(
            StackDialog.getActionButtonsForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stacks] are visible."
        );
        browser.waitForElementVisible(
            StackDialog.getRestoreButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Dialog] restore button is visible."
        );

        browser
            .click(StackDialog.getRestoreButtonForDashboard(StackDialog.CreateStack.CREATE_DASHBOARD_NAME))
            .waitForElementVisible(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                2000,
                "[Confirmation Dialog] is visible"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(MainPage.TABBED_PANEL);

        // Delete Stack
        browser
            .waitForElementVisible(MainPage.USER_MENU_BUTTON, 2000, "[User Menu Button] is visible.")
            .click(MainPage.USER_MENU_BUTTON);

        browser.click(MainPage.LOGOUT_BUTTON);

        browser.closeWindow().end();
    },
    "As an Administrator, I want to delete the shared Dashboard": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(
                StackDialog.getDeleteButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
                2000,
                "[Stack Dialog] is visible."
            );

        browser
            .pause(500)
            .click(StackDialog.getDeleteButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME))
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
    }
};
