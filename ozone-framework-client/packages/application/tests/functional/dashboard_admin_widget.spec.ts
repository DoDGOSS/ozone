import { NightwatchAPI } from "nightwatch";

import { DashboardAdminWidget } from "./selectors";

import { AdminWidgetType, loggedInAs, openAdminWidget } from "./helpers";

module.exports = {
    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all dashboards in the Dashboard Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");
        openAdminWidget(browser, AdminWidgetType.DASHBOARDS);

        browser.waitForElementVisible(DashboardAdminWidget.DIALOG, 2000, "[Dashboard Admin Widget] is visible");

        /* browser.assert.containsText(
            DashboardAdminWidget.DIALOG,
            "Dashboard Administration",
            "[Dashboard Admin Widget] Displays dashboard information"
        ); */

        browser.closeWindow().end();
    }
}