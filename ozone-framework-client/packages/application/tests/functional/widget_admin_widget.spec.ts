import { NightwatchAPI } from "nightwatch";

import { WidgetAdminWidget } from "./selectors";

import { AdminWidgetType, loggedInAs, openAdminWidget } from "./helpers";

const LOGIN_USERNAME: string = "testAdmin1";
const LOGIN_PASSWORD: string = "password";

module.exports = {
    // TODO - Change test to launch the widget when functionality is implemented
    // "As an Administrator, I can view all Widgets in the Widget Admin Widget": (browser: NightwatchAPI) => {
    //     loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
    //     openAdminWidget(browser, AdminWidgetType.WIDGETS);

    //     browser.assert.containsText(
    //         WidgetAdminWidget.Main.DIALOG,
    //         "Group Editor",
    //         "[Widget Admin Widget] Displays widgets"
    //     );

    //     browser.assert.containsText(
    //         WidgetAdminWidget.Main.DIALOG,
    //         "admin/GroupEdit",
    //         "[Widget Admin Widget] Displays widgets"
    //     );

    //     browser.closeWindow().end();
    // },

    "As an Administrator, I can create a new widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, LOGIN_USERNAME, LOGIN_PASSWORD, "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.WIDGETS);

        browser.waitForElementVisible(WidgetAdminWidget.Main.DIALOG, 1000, "[Widget Admin Widget] is visible");

        browser.waitForElementVisible(
            WidgetAdminWidget.Main.CREATE_BUTTON,
            1000,
            "[Widget Admin Widget Create Button] is visible"
        );

        browser
            .click(WidgetAdminWidget.Main.CREATE_BUTTON)
            .waitForElementPresent(
                WidgetAdminWidget.CreateWidget.SHOW_CREATE_FORM,
                1000,
                undefined,
                undefined,
                "[Show Create Form Link] is present"
            );

        browser
            .click(WidgetAdminWidget.CreateWidget.SHOW_CREATE_FORM)
            .waitForElementPresent(
                WidgetAdminWidget.CreateWidget.FORM,
                1000,
                undefined,
                undefined,
                "[Create Widget Form] is present"
            );

        browser
            .waitForElementPresent(
                WidgetAdminWidget.CreateWidget.SUBMIT_BUTTON,
                1000,
                undefined,
                undefined,
                "[Create Widget Submit Button] is present"
            );

        browser.getAttribute(WidgetAdminWidget.CreateWidget.SUBMIT_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, "true", "[Create Widget Submit Button] is disabled");
        });

        const NEW_WIDGET_NAME: string = "ExampleOzoneWidget";
        const NEW_WIDGET_DESCRIPTION: string = "An Example Ozone Widget";
        const NEW_WIDGET_VERSION: string = "3.14";
        const NEW_WIDGET_UNIVERSAL_NAME: string = "mil.navy.spawar.geocent.widgets.example";
        const NEW_WIDGET_URL: string = "http://example.mil/index.html";
        const NEW_WIDGET_SMALL_ICON_URL: string = "http://example.mil/images/icon-small.png";
        const NEW_WIDGET_MEDIUM_ICON_URL: string = "http://example.mil/images/icon-medium.png";
        const NEW_WIDGET_WIDTH: string = "250";
        const NEW_WIDGET_HEIGHT: string = "300";

        browser
            .setValue(WidgetAdminWidget.CreateWidget.NAME_INPUT, NEW_WIDGET_NAME)
            .setValue(WidgetAdminWidget.CreateWidget.DESCRIPTION_INPUT, NEW_WIDGET_DESCRIPTION)
            .setValue(WidgetAdminWidget.CreateWidget.VERSION_INPUT, NEW_WIDGET_VERSION)
            .setValue(WidgetAdminWidget.CreateWidget.UNIVERSAL_NAME_INPUT, NEW_WIDGET_UNIVERSAL_NAME)
            .setValue(WidgetAdminWidget.CreateWidget.URL_INPUT, NEW_WIDGET_URL)
            .setValue(WidgetAdminWidget.CreateWidget.SMALL_ICON_INPUT, NEW_WIDGET_SMALL_ICON_URL)
            .setValue(WidgetAdminWidget.CreateWidget.MEDIUM_ICON_INPUT, NEW_WIDGET_MEDIUM_ICON_URL)
            .clearValue(WidgetAdminWidget.CreateWidget.WIDTH_INPUT)
            .setValue(WidgetAdminWidget.CreateWidget.WIDTH_INPUT, NEW_WIDGET_WIDTH)
            .clearValue(WidgetAdminWidget.CreateWidget.HEIGHT_INPUT)
            .setValue(WidgetAdminWidget.CreateWidget.HEIGHT_INPUT, NEW_WIDGET_HEIGHT)
            .pause(1000);

        browser
            .click(WidgetAdminWidget.CreateWidget.WIDGET_TYPE_BUTTON)
            .click("a.bp3-menu-item:first-child")
            .pause(1000);

        browser.getAttribute(WidgetAdminWidget.CreateWidget.SUBMIT_BUTTON, "disabled", function(result) {
            this.assert.equal(result.value, null, "[Create Widget Submit Button] is enabled");
        });

        browser
            .click(WidgetAdminWidget.CreateWidget.SUBMIT_BUTTON)
            .pause(1000)
            .waitForElementNotPresent(WidgetAdminWidget.CreateWidget.FORM, 1000, "[Create Widget Form] is closed");

        // browser.expect.element(GroupAdminWidget.Main.DIALOG).text.to.contain(NEW_GROUP_NAME);

        browser.closeWindow().end();
    },
};
