/**
 * Waits for an element to be visible and clicks it. Properly throws Selenium exceptions when click fails,
 * unlike the native click command in Nightwatch.js.
 *
 * Example: browser.waitAndClick('button', callback);
 *
 * @name waitAndClick
 * @param selector - Selector of element (ie. '[data-qa=Element]')
 * @param callback - Optional function to run after click
 */

exports.command = function(selector: string, delay: number, callback: Function) {
    const self = this;
    this.waitForElementVisible(selector);

    if (delay) {
        this.pause(delay);
    }

    this.click(selector, (result: any) => {
        if (result.status !== 0 && result.errorStatus !== 13) {
            self.assert.fail(JSON.stringify(result));
        } else if (result.status !== 0 && result.errorStatus === 13) {
            const message = result.value.message;
            console.log(
                ` ♦  Attempted to click ${selector} but received \n ${message},\n waiting 1s and attempting again`
            );
            self.pause(1000);
            self.click(selector, (result2: any) => {
                if (result2.status !== 0) {
                    self.assert.fail(JSON.stringify(result2));
                } else if (callback !== undefined) {
                    callback();
                }
            });
        } else if (callback !== undefined) {
            callback();
        }
    });
};
