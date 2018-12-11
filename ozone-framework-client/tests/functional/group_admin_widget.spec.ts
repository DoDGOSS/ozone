import { NightwatchAPI } from "nightwatch";

import { AdminWidget } from "./selectors";

import { loggedInAs } from "./helpers";


export default {

    // TODO - Change test to launch the widget when functionality is implemented
    "As an Administrator, I can view all Groups in the Group Admin Widget": (browser: NightwatchAPI) => {
        loggedInAs(browser, "testAdmin1", "password", "Test Administrator 1");

        browser.waitForElementVisible(AdminWidget.ADMIN_WIDGET, 1000, "[Group Admin Widget] is visible");

        browser.assert.containsText(
            AdminWidget.GROUP_ADMIN_WIDGET_DIALOG, "OWF Administrators",
            "[User Group Widget] Displays group information");

        browser.closeWindow().end();
    },
};
