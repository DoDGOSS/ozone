import { NightwatchAPI } from "./nightwatch";

export abstract class PageObject {
    protected constructor(
        protected readonly browser: NightwatchAPI,
        protected readonly rootSelector: string,
        protected readonly displayName: string
    ) {}

    msg(message: string): string {
        return `[${this.displayName}] ${message}`;
    }

    clickWhenVisible(selector: string, message: string): this {
        this.waitForElementVisible(selector, message);
        this.browser.click(selector);
        return this;
    }

    waitUntilVisible(): this {
        this.browser.waitForElementVisible(this.rootSelector, undefined, this.msg("is visible"));
        return this;
    }

    waitUntilNotPresent(): this {
        this.browser.waitForElementNotPresent(this.rootSelector, undefined, this.msg(`is not visible`));
        return this;
    }

    waitUntilNotVisible(): this {
        this.browser.waitForElementNotVisible(this.rootSelector, undefined, this.msg(`is not visible`));
        return this;
    }

    waitForElementVisible(selector: string, displayName: string): this {
        this.browser.waitForElementVisible(selector, undefined, this.msg(`${displayName} is visible`));
        return this;
    }

    waitForElementNotVisible(selector: string, displayName: string): this {
        this.browser.waitForElementNotVisible(selector, undefined, this.msg(`${displayName} is not visible`));
        return this;
    }

    waitForElementPresent(selector: string, displayName: string): this {
        this.browser.waitForElementPresent(selector, undefined, this.msg(`${displayName} is present`));
        return this;
    }
}
