import { NightwatchAPI } from "nightwatch";

import { GlobalElements, StackAdminWidget, SystemConfigAdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";
import { SysConfigAdmin } from "./pages";

const LOGIN_USERNAME: string = "admin";
const LOGIN_PASSWORD: string = "password";

// TODO - Write test to set settings back to default

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
    },
    "As an Administrator, I can add a background image using sysconfig admin widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_BRANDING, 2000, "[Branding Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.CUSTOM_BACKGROUND_URL,
                2000,
                "[Background Url Input] is visible."
            )
            .getValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_BACKGROUND_URL} input`, () => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.CUSTOM_BACKGROUND_URL)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_BACKGROUND_URL} input`)
                    .setValue(
                        `${SystemConfigAdminWidget.InputSelector.CUSTOM_BACKGROUND_URL} input`,
                        `${SystemConfigAdminWidget.InputTestValues.BACKGROUND_IMG_URL_VAL}`
                    )
                    .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING)
                    .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING)
                    .click(StackAdminWidget.CLOSE_DAW_BUTTON);
            });

        browser.waitForElementVisible(
            GlobalElements.CUSTOM_BACKGROUND_IMAGE,
            2000,
            "[Custom Background Image] is visible."
        );

        browser.closeWindow().end();
    },
    "As an Administrator, I can add a header using sysconfig admin widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_BRANDING, 2000, "[Branding Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_URL,
                2000,
                "[Header Url Input] is visible."
            )
            .getValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_URL} input`, () => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_URL)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_URL} input`)
                    .setValue(
                        `${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_URL} input`,
                        `${SystemConfigAdminWidget.InputTestValues.HEADER_URL_VAL}`
                    )
                    .click(SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_HEIGHT)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_HEIGHT} input`)
                    .setValue(
                        `${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADER_HEIGHT} input`,
                        `${SystemConfigAdminWidget.InputTestValues.HEADER_HEIGHT_VAL}`
                    )
                    .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING)
                    .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING)
                    .click(StackAdminWidget.CLOSE_DAW_BUTTON);
            });

        browser.waitForElementVisible(GlobalElements.CUSTOM_HEADER, 2000, "[Custom Header] is visible.");

        browser.closeWindow().end();
    },
    "As an Administrator, I can add a footer using sysconfig admin widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_BRANDING, 2000, "[Branding Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_URL,
                2000,
                "[Footer Url Input] is visible."
            )
            .getValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_URL} input`, () => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_URL)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_URL} input`)
                    .setValue(
                        `${SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_URL} input`,
                        `${SystemConfigAdminWidget.InputTestValues.FOOTER_URL_VAL}`
                    )
                    .click(SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_HEIGHT)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_HEIGHT} input`)
                    .setValue(
                        `${SystemConfigAdminWidget.InputSelector.CUSTOM_FOOTER_HEIGHT} input`,
                        `${SystemConfigAdminWidget.InputTestValues.HEADER_HEIGHT_VAL}`
                    )
                    .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING)
                    .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING)
                    .click(StackAdminWidget.CLOSE_DAW_BUTTON);
            });

        browser.waitForElementVisible(GlobalElements.CUSTOM_FOOTER, 2000, "[Custom Footer] is visible.");

        browser.closeWindow().end();
    },
    "As an Administrator, I can add css files using sysconfig admin widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_BRANDING, 2000, "[Branding Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_CSS,
                2000,
                "[Custom CSS Input] is visible."
            )
            .getValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_CSS} input`, () => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_CSS)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_CSS} input`)
                    .setValue(
                        `${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_CSS} input`,
                        `${SystemConfigAdminWidget.InputTestValues.CSS_IMPORT_1_VAL}`
                    )
                    .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING)
                    .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);
            });

        browser.waitForElementPresent(GlobalElements.CUSTOM_CSS, 2000, "[Custom CSS] is present.");

        browser.closeWindow().end();
    },
    "As an Administrator, I can add js files using sysconfig admin widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        SysConfigAdmin.navigateTo(browser);

        browser.waitForElementVisible(
            SystemConfigAdminWidget.Main.DIALOG,
            2000,
            "[System Config Admin Widget] is visible."
        );

        browser
            .waitForElementVisible(SystemConfigAdminWidget.TabSelector.TAB_BRANDING, 2000, "[Branding Tab] is visible.")
            .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);

        browser
            .waitForElementVisible(
                SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_JS,
                2000,
                "[Custom JS Input] is visible."
            )
            .getValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_JS} input`, () => {
                browser
                    .click(SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_JS)
                    .clearValue(`${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_JS} input`)
                    .setValue(
                        `${SystemConfigAdminWidget.InputSelector.CUSTOM_HEADFOOT_JS} input`,
                        `${SystemConfigAdminWidget.InputTestValues.JS_IMPORT_1_VAL}`
                    )
                    .click(SystemConfigAdminWidget.TabSelector.TAB_AUDITING)
                    .click(SystemConfigAdminWidget.TabSelector.TAB_BRANDING);
            });

        browser.waitForElementPresent(GlobalElements.CUSTOM_JS, 2000, "[Custom JS] is present.");

        browser.closeWindow().end();
    }
};
