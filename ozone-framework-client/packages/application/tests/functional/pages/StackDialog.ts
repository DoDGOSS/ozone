import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

export class StackDialog extends PageObject {
    static Selector = `div[data-element-id="stack-dialog"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, StackDialog.Selector, "Stack dialog");
    }
}
