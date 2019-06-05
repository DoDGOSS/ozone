import { NightwatchAPI } from "../nightwatch";

import { PageObject } from "./PageObject";
import { GlobalElements } from "../selectors";

export class WidgetAdmin extends PageObject {
    static Selector = `div[data-element-id="widget-admin-widget-dialog"]`;

    static SearchField = `${WidgetAdmin.Selector} input[data-element-id='search-field']`;

    static CreateButton = `${WidgetAdmin.Selector} button[data-element-id="widget-admin-widget-create-button"]`;

    static editWidgetButton = (title: string) => `${GlobalElements.STD_EDIT_BUTTON}[data-widget-title="${title}"]`;

    static editMenuWidgetButton = (title: string) =>
        `${GlobalElements.STD_EDIT_MENU_BUTTON}[data-widget-title="${title}"]`;

    static deleteWidgetButton = (title: string) => `${GlobalElements.STD_DELETE_BUTTON}[data-widget-title="${title}"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, WidgetAdmin.Selector, "Widget Admin Widget");
    }

    assertContainsWidget(title: string): this {
        this.browser.assert.containsText(
            WidgetAdmin.Selector,
            title,
            this.msg(`contains widget row with title '${title}'`)
        );
        return this;
    }

    assertNotContainsWidget(title: string): this {
        this.browser.expect.element(WidgetAdmin.Selector).text.to.not.contain(title);
        return this;
    }

    clickCreateButton(): WidgetAdminCreateForm {
        this.clickWhenVisible(WidgetAdmin.CreateButton, "[Widget Admin Widget] Create button is visible");
        return this.open(WidgetAdminCreateForm).waitUntilVisible();
    }

    setSearchValue(value: string): this {
        this.browser.setValue(WidgetAdmin.SearchField, value);
        return this;
    }

    assertCanEditWidget(title: string): this {
        this.browser.getAttribute(WidgetAdmin.editWidgetButton(title), "disabled", (result) => {
            this.browser.assert.equal(
                result.value,
                null,
                this.msg(`Edit button is enabled for widget with title '${title}'`)
            );
        });
        return this;
    }

    editWidget(title: string): WidgetAdminPropertiesPanel {
        this.browser.click(WidgetAdmin.editWidgetButton(title));
        return this.open(WidgetAdminPropertiesPanel).waitUntilVisible();
    }

    editMenuWidget(title: string): WidgetAdminEditMenuPopover {
        this.browser.click(WidgetAdmin.editMenuWidgetButton(title));
        return this.open(WidgetAdminEditMenuPopover).waitUntilVisible();
    }

    assertCanDeleteWidget(title: string): this {
        this.browser.getAttribute(WidgetAdmin.deleteWidgetButton(title), "disabled", (result) => {
            this.browser.assert.equal(
                result.value,
                null,
                this.msg(`Delete button is enabled for widget with title '${title}'`)
            );
        });
        return this;
    }

    deleteWidget(title: string): this {
        this.browser.click(WidgetAdmin.deleteWidgetButton(title));
        return this;
    }
}

export class WidgetAdminCreateForm extends PageObject {
    static DescriptorInput = `input[data-element-id="widget-admin-widget-descriptor-url-field"]`;
    static LoadButton = `button[data-element-id="widget-admin-widget-load-descriptor-button"]`;
    static LoadErrorMessage = `span[data-element-id="widget-admin-widget-descriptor-error-message"]`;
    static CreateWithoutDescriptor = `a[data-element-id="widget-admin-widget-show-properties-form"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, "", "Widget Admin Create Form");
    }

    waitUntilVisible(): this {
        // TODO
        return this;
    }

    assertLoadButtonIsDisabled(): this {
        this.browser.getAttribute(WidgetAdminCreateForm.LoadButton, "disabled", (result) => {
            this.browser.assert.equal(result.value, "true", this.msg("Load button is disabled"));
        });
        return this;
    }

    assertLoadButtonIsEnabled(): this {
        this.browser.getAttribute(WidgetAdminCreateForm.LoadButton, "disabled", (result) => {
            this.browser.assert.equal(result.value, null, this.msg("Load button is enabled"));
        });
        return this;
    }

    clickLoadButton(): this {
        this.clickWhenVisible(WidgetAdminCreateForm.LoadButton, "'Load descriptor'");
        return this;
    }

    clickCreateWithoutDescriptor(): WidgetAdminPropertiesPanel {
        this.clickWhenVisible(WidgetAdminCreateForm.CreateWithoutDescriptor, "'Create without descriptor'");
        return this.open(WidgetAdminPropertiesPanel).waitUntilVisible();
    }
}

export class WidgetAdminPropertiesPanel extends PageObject {
    static Selector = "div[data-element-id='widget-admin-widget-properties-form']";

    static SubmitButton =
        "div[data-element-id='admin-widget-properties-submit-button'] > button[data-element-id='form-submit-button']";
    static BackButton = `div[data-element-id="widget-admin-widget-setup-return-button"] button`;

    constructor(browser: NightwatchAPI) {
        super(browser, WidgetAdminPropertiesPanel.Selector, "Widget Admin Create Form - Properties Panel");
    }

    assertContainsSubmitButton(): this {
        return this.waitForElementPresent(WidgetAdminPropertiesPanel.SubmitButton, "Submit button");
    }

    assertSubmitButtonIsDisabled(): this {
        this.browser.getAttribute(WidgetAdminPropertiesPanel.SubmitButton, "disabled", (result) => {
            this.browser.assert.equal(result.value, "true", this.msg("Submit button should be disabled"));
        });
        return this;
    }

    assertSubmitButtonIsEnabled(): this {
        this.browser.getAttribute(WidgetAdminPropertiesPanel.SubmitButton, "disabled", (result) => {
            this.browser.assert.equal(result.value, null, this.msg("Submit button should be enabled"));
        });
        return this;
    }

    clickSubmitButton(): this {
        this.browser.click(WidgetAdminPropertiesPanel.SubmitButton).pause(1000);
        return this;
    }

    clickBackButton(): WidgetAdmin {
        this.browser
            .click(WidgetAdminPropertiesPanel.BackButton)
            .waitForElementNotPresent(WidgetAdminPropertiesPanel.Selector, undefined, this.msg("is closed"))
            .pause(1000);

        return this.open(WidgetAdmin);
    }
}

export class WidgetAdminEditMenuPopover extends PageObject {
    static Selector = "ul[data-element-id='edit-menu']";
    static ExportButton = `a[data-element-id="export-button"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, WidgetAdminEditMenuPopover.Selector, "Widget Admin Edit Menu Popover");
    }

    assertContainsExportButton(): this {
        return this.waitForElementPresent(WidgetAdminEditMenuPopover.ExportButton, "Export button");
    }

    clickExportButton(): WidgetAdminExportDialog {
        this.browser.click(WidgetAdminEditMenuPopover.ExportButton).pause(1000);
        return this.open(WidgetAdminExportDialog);
    }
}

export class WidgetAdminExportDialog extends PageObject {
    static Selector = "form[data-element-id='export-dialog-form']";
    static ConfirmButton = `button[data-element-id="export-dialog-confirm"]`;
    static CancelButton = `button[data-element-id="export-dialog-cancel"]`;

    constructor(browser: NightwatchAPI) {
        super(browser, WidgetAdminExportDialog.Selector, "Widget Admin Export Dialog");
    }

    assertContainsConfirmButton(): this {
        return this.waitForElementPresent(WidgetAdminExportDialog.ConfirmButton, "Confirm button");
    }

    assertContainsCancelButton(): this {
        return this.waitForElementPresent(WidgetAdminExportDialog.CancelButton, "Cancel button");
    }

    assertConfirmButtonIsDisabled(): this {
        this.browser.getAttribute(WidgetAdminExportDialog.ConfirmButton, "disabled", (result) => {
            this.browser.assert.equal(result.value, "true", this.msg("Confirm button should be disabled"));
        });
        return this;
    }

    assertConfirmButtonIsEnabled(): this {
        this.browser.getAttribute(WidgetAdminExportDialog.ConfirmButton, "disabled", (result) => {
            this.browser.assert.equal(result.value, null, this.msg("Confirm button should be enabled"));
        });
        return this;
    }

    assertContainsErrorText(): this {
        this.browser.assert.containsText(
            WidgetAdminExportDialog.Selector,
            "Invalid characters!",
            this.msg(`Export dialog filename contains error`)
        );
        return this;
    }

    assertNotContainsErrorText(): this {
        this.browser.expect.element(WidgetAdminExportDialog.Selector).text.to.not.contain("Invalid characters!");
        return this;
    }

    clickConfirmButton(): WidgetAdmin {
        this.browser.click(WidgetAdminExportDialog.ConfirmButton).pause(1000);
        return this.open(WidgetAdmin);
    }
}
