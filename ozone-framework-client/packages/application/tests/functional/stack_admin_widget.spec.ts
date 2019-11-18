import { NightwatchAPI } from "nightwatch";

import { StackAdminWidget, GlobalElements, MainPage, StackDialog } from "./selectors";

import { loggedInAs } from "./helpers";
import { StackAdmin } from "./pages";

module.exports = {
    "As an Administrator, I can view all dashboards in the Stack Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        StackAdmin.navigateTo(browser);

        browser.closeWindow().end();
    },

    "As an Administrator, I can add and remove groups from a shared dashboard": (browser: NightwatchAPI) => {
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        // First create Dashboard for testing
        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible");

        browser
            .click(StackDialog.CREATE_STACK_BUTTON)
            .waitForElementVisible(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Submit Button] is visible");

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME);

        browser
            .click(StackDialog.CreateStack.SUBMIT)
            .waitForElementNotPresent(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Dialog] is closed")
            .click(MainPage.DIALOG_CLOSE);

        // NEXT we open admin dashboard widget, and try to add a group (add button should be disabled)

        StackAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Admin Widget Edit Button] is visible"
        );

        browser.click(StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME));

        browser.waitForElementVisible(StackAdminWidget.GROUPS_TAB, 2000, "[Stack Admin Widget Groups Tab] is visible.");

        browser.click(StackAdminWidget.GROUPS_TAB);

        browser.waitForElementVisible(
            StackAdminWidget.ADD_GROUP_BUTTON,
            2000,
            "[Stack Admin Widget Groups Tab] add button is visible."
        );

        browser.getAttribute(StackAdminWidget.ADD_GROUP_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Stack Admin Widget Groups Tab] add button is disabled.");
        });

        browser.click(StackAdminWidget.CLOSE_DAW_BUTTON);

        browser.waitForElementNotPresent(StackAdminWidget.DIALOG, 2000, "[Stack Admin Widget] has closed.");

        // Since the add button is disabled, we need to share the dashboard to allow us to add groups

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Dashboard Dialog] is visible.")
            .waitForElementVisible(
                StackDialog.getShareButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
                2000,
                "[Dashboard Dialog] share button is visible."
            );

        browser
            .click(StackDialog.getShareButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME))
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
            StackAdminWidget.DASHBOARD_DIALOG_CLOSE,
            2000,
            "[Dashboard Dialog] is safe to close."
        );

        browser.click(StackAdminWidget.DASHBOARD_DIALOG_CLOSE);

        // Now that the dashboard is shared, we should be able to add groups
        StackAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Admin Widget Edit Button] is visible."
        );

        browser.click(StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME));

        browser.waitForElementVisible(StackAdminWidget.GROUPS_TAB, 2000, "[Stack Admin Widget Groups Tab] is visible.");

        browser.click(StackAdminWidget.GROUPS_TAB);

        browser.waitForElementVisible(
            StackAdminWidget.ADD_GROUP_BUTTON,
            2000,
            "[Stack Admin Widget Groups Tab] add button is visible."
        );

        browser.getAttribute(StackAdminWidget.ADD_GROUP_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, null, "[Stack Admin Widget Groups Tab] add button is enabled.");
        });

        browser.click(StackAdminWidget.ADD_GROUP_BUTTON);

        browser.waitForElementVisible(
            GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG,
            2000,
            "[Add Group Dialog] is visible."
        );

        browser.waitForElementVisible(
            StackAdminWidget.ROW_BOX,
            2000,
            "[Add Group Dialog] rows are available for adding."
        );

        browser.waitForElementVisible(
            StackAdminWidget.FIRST_ROW,
            2000,
            "[Add Group Dialog] first group is present to select."
        );

        browser.click(StackAdminWidget.FIRST_ROW);

        browser.click(StackAdminWidget.SECOND_ROW);

        browser.click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON);

        browser.waitForElementVisible(
            StackAdminWidget.dashboardGroupTableDeleteButton(StackAdminWidget.FIRST_GROUP_NAME),
            3000,
            "[Stack Admin Widget Groups Tab] delete button is visible."
        );

        browser.click(StackAdminWidget.dashboardGroupTableDeleteButton(StackAdminWidget.FIRST_GROUP_NAME));

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
            StackAdminWidget.dashboardGroupTableDeleteButton(StackAdminWidget.FIRST_GROUP_NAME),
            2000,
            "[Stack Admin Widget Groups Tab] first group removed successfully."
        );

        browser.waitForElementVisible(
            StackAdminWidget.BACK_BUTTON,
            2000,
            "[Stack Admin Widget Groups Tab] Back button is visible."
        );
        browser.click(StackAdminWidget.BACK_BUTTON);

        browser.waitForElementPresent(
            StackAdminWidget.dashboardTableDeleteButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Admin Widget Delete Button] is present"
        );
        browser.moveToElement(
            StackAdminWidget.dashboardTableDeleteButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            0,
            0
        );

        browser.click(StackAdminWidget.dashboardTableDeleteButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME));

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
        loggedInAs(browser, "admin", "password", "Test Administrator 1");

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Stacks Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.CREATE_STACK_BUTTON, 2000, "[Create Stack Button] is visible.");

        browser
            .click(StackDialog.CREATE_STACK_BUTTON)
            .waitForElementVisible(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Submit Button] is visible.");

        browser.setValue(StackDialog.CreateStack.NAME_FIELD, StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME);

        browser
            .click(StackDialog.CreateStack.SUBMIT)
            .waitForElementNotPresent(StackDialog.CreateStack.SUBMIT, 2000, "[Create Stack Dialog] is closed.")
            .click(MainPage.DIALOG_CLOSE);

        // NEXT we open admin dashboard widget, and try to add a user (add button should be disabled)
        StackAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Admin Widget Edit Button] is visible"
        );

        browser.click(StackAdminWidget.dashboardTableEditButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME));

        browser.waitForElementVisible(StackAdminWidget.USERS_TAB, 2000, "[Stack Admin Widget Users Tab] is visible.");

        browser.click(StackAdminWidget.USERS_TAB);

        browser.waitForElementVisible(
            StackAdminWidget.ADD_USER_BUTTON,
            2000,
            "[Stack Admin Widget Users Tab] add button is visible."
        );

        browser.getAttribute(StackAdminWidget.ADD_USER_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Stack Admin Widget Users Tab] add button is disabled.");
        });

        browser.click(StackAdminWidget.CLOSE_DAW_BUTTON);

        browser.waitForElementNotPresent(StackAdminWidget.DIALOG, 2000, "[Stack Admin Widget] has closed.");

        // Since the add button is disabled, we need to share the dashboard to allow us to add users

        browser.waitForElementVisible(MainPage.STACKS_BUTTON, 2000, "[Dashboard Button] is visible.");

        browser
            .click(MainPage.STACKS_BUTTON)
            .waitForElementVisible(StackDialog.STACK_DIALOG, 2000, "[Dashboard Dialog] is visible.")
            .waitForElementVisible(
                StackDialog.getShareButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
                2000,
                "[Dashboard Dialog] share button is visible."
            );

        browser
            .click(StackDialog.getShareButtonForStack(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME))
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
            StackAdminWidget.DASHBOARD_DIALOG_CLOSE,
            2000,
            "[Dashboard Dialog] is safe to close."
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

        browser.getAttribute(StackAdminWidget.ADD_USER_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, null, "[Stack Admin Widget Users Tab] add button is enabled.");
        });

        browser.click(StackAdminWidget.ADD_USER_BUTTON);

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

        browser.waitForElementVisible(
            StackAdminWidget.SECOND_ROW,
            2000,
            "[Add User Dialog] second user is present to select."
        );
        browser.click(StackAdminWidget.SECOND_ROW);

        browser.waitForElementVisible(
            GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON,
            2000,
            "[Add User Dialog] Ok button is visible."
        );
        browser.pause(2000).click(GlobalElements.GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON);

        browser
            .pause(2000)
            .waitForElementVisible(
                StackAdminWidget.dashboardUserTableDeleteButton(StackAdminWidget.FIRST_USERNAME),
                3000,
                "[Stack Admin Widget Users Tab] delete button is visible."
            );
        browser.click(StackAdminWidget.dashboardUserTableDeleteButton(StackAdminWidget.FIRST_USERNAME));

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
            StackAdminWidget.dashboardUserTableDeleteButton(StackAdminWidget.FIRST_USERNAME),
            2000,
            "[Stack Admin Widget Users Tab] first user removed successfully."
        );

        browser.waitForElementVisible(
            StackAdminWidget.BACK_BUTTON,
            2000,
            "[Stack Admin Widget Users Tab] Back button is visible."
        );
        browser.click(StackAdminWidget.BACK_BUTTON);

        browser.waitForElementPresent(
            StackAdminWidget.dashboardTableDeleteButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            2000,
            "[Stack Admin Widget Delete Button] is present"
        );
        browser.moveToElement(
            StackAdminWidget.dashboardTableDeleteButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME),
            0,
            0
        );

        browser.click(StackAdminWidget.dashboardTableDeleteButton(StackAdminWidget.STACK_ADMIN_TEST_DASHBOARD_NAME));

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
