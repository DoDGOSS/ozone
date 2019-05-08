import { NightwatchAPI } from "nightwatch";

import { SystemConfigAdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";
import { SysConfigAdmin } from "./pages";

const LOGIN_USERNAME: string = "testAdmin1";
const LOGIN_PASSWORD: string = "password";

module.exports = {
    "As an Administrator, I can toggle an auditing setting": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_AUDITING, 2000, "[Auditing Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.FIRST_TOGGLE,
                2000,
                "[Toggle Input] is visible."
            )
            .getAttribute(`${SystemConfigAdminWidget.InputSelector.FIRST_TOGGLE} input`, "checked", (firstresult) => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.FIRST_TOGGLE)
                    .getAttribute(
                        `${SystemConfigAdminWidget.InputSelector.FIRST_TOGGLE} input`,
                        "checked",
                        (secondresult) => {
                            browser.verify.notEqual(
                                firstresult.value,
                                secondresult.value,
                                "[Toggle Input] updated successfully."
                            );
                        }
                    );
            });

        browser.closeWindow().end();
    },
    "As an Administrator, I can change a string based setting": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_AUDITING, 2000, "[Auditing Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.FIRST_STRING,
                2000,
                "[String Input] is visible."
            )
            .getValue(`${SystemConfigAdminWidget.InputSelector.FIRST_STRING} input`, (firstresult) => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.FIRST_STRING)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.FIRST_STRING} input`)
                    .setValue(`${SystemConfigAdminWidget.InputSelector.FIRST_STRING} input`, firstresult.value + "a")
                    .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING)
                    .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING)
                    .waitForElementVisible(
                        SystemConfigAdminWidget.InputSelector.FIRST_STRING,
                        2000,
                        "[String Input] is visible."
                    )
                    .getValue(`${SystemConfigAdminWidget.InputSelector.FIRST_STRING} input`, (secondresult) => {
                        browser.verify.equal(
                            firstresult.value + "a",
                            secondresult.value,
                            "[String Input] updated successfully."
                        );
                    });
            });

        browser.closeWindow().end();
    },
    "As an Administrator, I can change an integer based setting": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_BRANDING, 2000, "[Auditing Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.FIRST_INTEGER,
                2000,
                "[Integer Input] is visible."
            )
            .getValue(`${SystemConfigAdminWidget.InputSelector.FIRST_INTEGER} input`, (firstresult) => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.FIRST_INTEGER)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.FIRST_INTEGER} input`)
                    .setValue(`${SystemConfigAdminWidget.InputSelector.FIRST_INTEGER} input`, firstresult.value + "0")
                    .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING)
                    .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING)
                    .getValue(`${SystemConfigAdminWidget.InputSelector.FIRST_INTEGER} input`, (secondresult) => {
                        browser.verify.equal(
                            firstresult.value + "0",
                            secondresult.value,
                            "[Integer Input] updated successfully."
                        );
                    });
            });

        browser.closeWindow().end();
    }
};
