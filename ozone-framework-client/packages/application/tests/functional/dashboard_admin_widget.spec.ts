import { NightwatchAPI } from "nightwatch";

import { DashboardAdminWidget, GlobalElements, MainPage, StackDialog } from "./selectors";

import { loggedInAs } from "./helpers";
import { DashboardAdmin } from "./pages";

module.exports = {
    "As an Administrator, I can view all dashboards in the Dashboard Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        DashboardAdmin.navigateTo(browser);

        browser.closeWindow().end();
    },

    "As an Administrator, I can add and remove groups from a shared dashboard": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        // First create Dashboard for testing
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible");

        browser
            .click(StackDialog.CREATE_STACK_BUTTON)
            .waitForElementVisible(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Submit Button] is visible");

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME);

        browser
            .click(StackDialog.CreateStack.SUBMIT)
            .waitForElementNotPresent(StackDialog.CreateStack.SUBMIT, 1000, "[Create Stack Dialog] is closed")
            .click(MainPage.DIALOG_CLOSE);

        // NEXT we open admin dashboard widget, and try to add a group (add button should be disabled)

        DashboardAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Dashboard Admin Widget Edit Button] is visible"
        );

        browser.click(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME)
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.GROUPS_TAB,
            2000,
            "[Dashboard Admin Widget Groups Tab] is visible."
        );

        browser.click(DashboardAdminWidget.GROUPS_TAB);

        browser.waitForElementVisible(
            DashboardAdminWidget.ADD_GROUP_BUTTON,
            2000,
            "[Dashboard Admin Widget Groups Tab] add button is visible."
        );

        browser.getAttribute(DashboardAdminWidget.ADD_GROUP_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Dashboard Admin Widget Groups Tab] add button is disabled.");
        });

        browser.click(DashboardAdminWidget.CLOSE_DAW_BUTTON);

        browser.waitForElementNotPresent(DashboardAdminWidget.DIALOG, 2000, "[Dashboard Admin Widget] has closed.");

        // Since the add button is disabled, we need to share the dashboard to allow us to add groups

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Dashboard Dialog] is visible.")
            .waitForElementVisible(
                StackDialog.getShareButtonForStack(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
                2000,
                "[Dashboard Dialog] share button is visible."
            );

        browser
            .click(StackDialog.getShareButtonForStack(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME))
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.waitForElementVisible(
            DashboardAdminWidget.DASHBOARD_DIALOG_CLOSE,
            2000,
            "[Dashboard Dialog] is safe to close."
        );

        browser.click(DashboardAdminWidget.DASHBOARD_DIALOG_CLOSE);

        // Now that the dashboard is shared, we should be able to add groups
        DashboardAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Dashboard Admin Widget Edit Button] is visible."
        );

        browser.click(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME)
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.GROUPS_TAB,
            2000,
            "[Dashboard Admin Widget Groups Tab] is visible."
        );

        browser.click(DashboardAdminWidget.GROUPS_TAB);

        browser.waitForElementVisible(
            DashboardAdminWidget.ADD_GROUP_BUTTON,
            2000,
            "[Dashboard Admin Widget Groups Tab] add button is visible."
        );

        browser.getAttribute(DashboardAdminWidget.ADD_GROUP_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, null, "[Dashboard Admin Widget Groups Tab] add button is enabled.");
        });

        browser.click(DashboardAdminWidget.ADD_GROUP_BUTTON);

        browser.waitForElementVisible(
            GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG,
            2000,
            "[Add Group Dialog] is visible."
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.ROW_BOX,
            2000,
            "[Add Group Dialog] rows are available for adding."
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.FIRST_ROW,
            2000,
            "[Add Group Dialog] first group is present to select."
        );

        browser.click(DashboardAdminWidget.FIRST_ROW);

        browser.click(DashboardAdminWidget.SECOND_ROW);

        browser.click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON);

        browser.waitForElementVisible(
            DashboardAdminWidget.dashboardGroupTableDeleteButton(DashboardAdminWidget.FIRST_GROUP_NAME),
            2000,
            "[Dashboard Admin Widget Groups Tab] delete button is visible."
        );

        browser.click(DashboardAdminWidget.dashboardGroupTableDeleteButton(DashboardAdminWidget.FIRST_GROUP_NAME));

        browser
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.waitForElementNotPresent(
            DashboardAdminWidget.dashboardGroupTableDeleteButton(DashboardAdminWidget.FIRST_GROUP_NAME),
            2000,
            "[Dashboard Admin Widget Groups Tab] first group removed successfully."
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.BACK_BUTTON,
            2000,
            "[Dashboard Admin Widget Groups Tab] Back button is visible."
        );
        browser.click(DashboardAdminWidget.BACK_BUTTON);

        browser.waitForElementPresent(
            DashboardAdminWidget.dashboardTableDeleteButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Dashboard Admin Widget Delete Button] is present"
        );
        browser.moveToElement(
            DashboardAdminWidget.dashboardTableDeleteButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            0,
            0
        );

        browser.click(
            DashboardAdminWidget.dashboardTableDeleteButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME)
        );

        browser
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.closeWindow().end();
    },

    "As an Administrator, I can add and remove users from a shared dashboard": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible.");

        browser
            .click(StackDialog.CREATE_STACK_BUTTON)
            .waitForElementVisible(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Submit Button] is visible.");

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME);

        browser
            .click(StackDialog.CreateStack.SUBMIT)
            .waitForElementNotPresent(StackDialog.CreateStack.SUBMIT, 1000, "[Create Stack Dialog] is closed.")
            .click(MainPage.DIALOG_CLOSE);

        // NEXT we open admin dashboard widget, and try to add a user (add button should be disabled)
        DashboardAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Dashboard Admin Widget Edit Button] is visible"
        );

        browser.click(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME)
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.USERS_TAB,
            2000,
            "[Dashboard Admin Widget Users Tab] is visible."
        );

        browser.click(DashboardAdminWidget.USERS_TAB);

        browser.waitForElementVisible(
            DashboardAdminWidget.ADD_USER_BUTTON,
            2000,
            "[Dashboard Admin Widget Users Tab] add button is visible."
        );

        browser.getAttribute(DashboardAdminWidget.ADD_USER_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Dashboard Admin Widget Users Tab] add button is disabled.");
        });

        browser.click(DashboardAdminWidget.CLOSE_DAW_BUTTON);

        browser.waitForElementNotPresent(DashboardAdminWidget.DIALOG, 2000, "[Dashboard Admin Widget] has closed.");

        // Since the add button is disabled, we need to share the dashboard to allow us to add users

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Dashboard Dialog] is visible.")
            .waitForElementVisible(
                StackDialog.getShareButtonForStack(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
                2000,
                "[Dashboard Dialog] share button is visible."
            );

        browser
            .click(StackDialog.getShareButtonForStack(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME))
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.waitForElementVisible(
            DashboardAdminWidget.DASHBOARD_DIALOG_CLOSE,
            2000,
            "[Dashboard Dialog] is safe to close."
        );

        browser.click(DashboardAdminWidget.DASHBOARD_DIALOG_CLOSE);

        // Now that the dashboard is shared, we should be able to add users
        DashboardAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Dashboard Admin Widget Edit Button] is visible."
        );

        browser.click(
            DashboardAdminWidget.dashboardTableEditButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME)
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.USERS_TAB,
            2000,
            "[Dashboard Admin Widget Users Tab] is visible."
        );

        browser.click(DashboardAdminWidget.USERS_TAB);

        browser.waitForElementVisible(
            DashboardAdminWidget.ADD_USER_BUTTON,
            2000,
            "[Dashboard Admin Widget Users Tab] add button is visible."
        );

        browser.getAttribute(DashboardAdminWidget.ADD_USER_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, null, "[Dashboard Admin Widget Users Tab] add button is enabled.");
        });

        browser.click(DashboardAdminWidget.ADD_USER_BUTTON);

        browser.waitForElementVisible(
            GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG,
            2000,
            "[Add User Dialog] is visible."
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.ROW_BOX,
            2000,
            "[Add User Dialog] rows are available for adding."
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.FIRST_ROW,
            2000,
            "[Add User Dialog] first user is present to select."
        );

        browser.click(DashboardAdminWidget.FIRST_ROW);

        browser.click(DashboardAdminWidget.SECOND_ROW);

        browser.click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON);

        browser.waitForElementVisible(
            DashboardAdminWidget.dashboardUserTableDeleteButton(DashboardAdminWidget.FIRST_USERNAME),
            2000,
            "[Dashboard Admin Widget Users Tab] delete button is visible."
        );

        browser.click(DashboardAdminWidget.dashboardUserTableDeleteButton(DashboardAdminWidget.FIRST_USERNAME));

        browser
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.waitForElementNotPresent(
            DashboardAdminWidget.dashboardUserTableDeleteButton(DashboardAdminWidget.FIRST_USERNAME),
            2000,
            "[Dashboard Admin Widget Users Tab] first user removed successfully."
        );

        browser.waitForElementVisible(
            DashboardAdminWidget.BACK_BUTTON,
            2000,
            "[Dashboard Admin Widget Users Tab] Back button is visible."
        );
        browser.click(DashboardAdminWidget.BACK_BUTTON);

        browser.waitForElementPresent(
            DashboardAdminWidget.dashboardTableDeleteButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Dashboard Admin Widget Delete Button] is present"
        );
        browser.moveToElement(
            DashboardAdminWidget.dashboardTableDeleteButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME),
            0,
            0
        );

        browser.click(
            DashboardAdminWidget.dashboardTableDeleteButton(DashboardAdminWidget.DASHBOARD_ADMIN_TEST_DASHBOARD_NAME)
        );

        browser
            .waitForElementPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                undefined,
                undefined,
                "[Confirmation Dialog] is present"
            )
            .click(GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON)
            .waitForElementNotPresent(
                GlobalElements.CONFIRMATION_DIALOG_CONFIRM_BUTTON,
                1000,
                "[Confirmation Dialog] is not present"
            );

        browser.closeWindow().end();
    }
};
