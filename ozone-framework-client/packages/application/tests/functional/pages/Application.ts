import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { ConsentPage } from "./ConsentPage";

export class Application extends PageObject {
    static Selector = "#root";

    constructor(browser: NightwatchAPI) {
        super(browser, Application.Selector, "Application");

        browser.url("http://localhost:8000");
    }

    waitForConsentPage(): ConsentPage {
        return this.open(ConsentPage).waitUntilVisible(7000);
    }
}
