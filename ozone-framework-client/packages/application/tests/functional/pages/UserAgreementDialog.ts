import { PageObject } from "./PageObject";
import { NightwatchAPI } from "../nightwatch";
import { ConsentPage } from "./ConsentPage";

export class UserAgreementDialog extends PageObject {
    static Selector = `div[data-test-id="user-agreement"]`;

    static BackButton = `button[data-test-id="user-agreement-back-button"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, UserAgreementDialog.Selector, "User Agreement dialog");
    }

    clickBackButton(): ConsentPage {
        this.clickWhenVisible(UserAgreementDialog.BackButton, "Back button");
        this.waitUntilNotPresent();
        return this.open(ConsentPage).waitUntilVisible();
    }
}
