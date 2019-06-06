import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";

import { LoginPage } from "./LoginPage";
import { UserAgreementDialog } from "./UserAgreementDialog";

export class ConsentPage extends PageObject {
    static Selector = `div[data-test-id="consent-notice"]`;

    static UserAgreementLink = `div[data-test-id="consent-notice"] a`;
    static AcceptButton = `div[data-test-role="dialog-actions"] button`;

    constructor(browser: NightwatchAPI) {
        super(browser, ConsentPage.Selector, "Consent Page");
    }

    openUserAgreement(): UserAgreementDialog {
        this.clickWhenVisible(ConsentPage.UserAgreementLink, "User Agreement link");
        this.waitUntilNotPresent();
        return this.open(UserAgreementDialog).waitUntilVisible();
    }

    clickAcceptButton(): LoginPage {
        this.clickWhenVisible(ConsentPage.AcceptButton, "Accept button");
        this.waitUntilNotPresent(10000);
        return this.open(LoginPage).waitUntilVisible(5000);
    }
}
