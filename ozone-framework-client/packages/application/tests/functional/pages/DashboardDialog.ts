import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

export class DashboardDialog extends PageObject {
    static Selector = `div[data-element-id="dashboard-dialog"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, DashboardDialog.Selector, "Dashboard dialog");
    }
}
