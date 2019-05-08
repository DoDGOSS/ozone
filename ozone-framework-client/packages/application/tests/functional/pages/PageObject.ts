import { NightwatchAPI } from "../nightwatch";

export class PageElement {
    constructor(readonly selector: string, readonly description?: string) {}
}

export type PageObjectType<T> = { new (browser: NightwatchAPI): T };

export abstract class PageObject {
    protected constructor(
        protected readonly browser: NightwatchAPI,
        protected readonly rootSelector: string,
        protected readonly displayName: string
    ) {}

    msg(message: string): string {
        return `[${this.displayName}] ${message}`;
    }

    open<T extends PageObject>(page: PageObjectType<T>): T {
        return new page(this.browser);
    }

    clickWhenVisible(element: PageElement): this;
    clickWhenVisible(selector: string, message?: string): this;
    clickWhenVisible(target: string | PageElement, message?: string): this {
        const element = getElem(target, message);
        this.waitForElementVisible(element.selector, element.description);
        this.browser.click(element.selector);
        return this;
    }

    waitUntilVisible(ms?: number): this {
        this.browser.waitForElementVisible(this.rootSelector, ms, this.msg("is visible"));
        return this;
    }

    waitUntilNotPresent(ms?: number): this {
        this.browser.waitForElementNotPresent(this.rootSelector, ms, this.msg(`is not visible`));
        return this;
    }

    waitUntilNotVisible(ms?: number): this {
        this.browser.waitForElementNotVisible(this.rootSelector, ms, this.msg(`is not visible`));
        return this;
    }

    waitForElementVisible(selector: string, displayName?: string): this {
        this.browser.waitForElementVisible(selector, undefined, this.msg(`${displayName || "element"} is visible`));
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

function getElem(target: string | PageElement, message?: string): PageElement {
    if (typeof target === "string") {
        return new PageElement(target, message);
    }
    return target;
}
