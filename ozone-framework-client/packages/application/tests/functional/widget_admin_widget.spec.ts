import { NightwatchAPI } from "nightwatch";

import { WidgetAdminWidget } from "./selectors";

import { AdminWidgetType, loggedInAs, openAdminWidget } from "./helpers";

module.exports = {
    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Widgets in the Widget Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.WIDGETS);

        browser.assert.containsText(
            WidgetAdminWidget.Main.DIALOG,
            "Group Editor",
            "[Widget Admin Widget] Displays widgets"
        );

        browser.assert.containsText(
            WidgetAdminWidget.Main.DIALOG,
            "admin/GroupEdit",
            "[Widget Admin Widget] Displays widgets"
        );

        browser.closeWindow().end();
    }
};
