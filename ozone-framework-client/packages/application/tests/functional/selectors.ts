export const SYSTEMCONFIG_MENU_ADMIN_BUTTON = "div[data-element-id='System Configuration']";
export namespace MainPage {
    export const LOGIN_BUTTON = "button[data-element-id='login-button']";

    export const LOGIN_DIALOG = "div[data-element-id='login-dialog']";

    export const USER_MENU_BUTTON = "button[data-element-id='user-menu-button']";

    export const USER_MENU = "ul[data-element-id='user-menu']";

    export const ABOUT_BUTTON = "a[data-element-id='about-button']";

    export const ABOUT_DIALOG = "div[data-element-id='about-dialog']";

    export const HELP_DIALOG = "div[data-element-id='help-dialog']";

    export const HELP_BUTTON = "button[data-element-id='help-button']";

    export const HELP_SAMPLE_FILE = ".bp3-tree-node-content-0";

    export const ADMINISTRATION_BUTTON = "a[data-element-id='administration']";

    export const ADMINISTRATION_MENU = "div[data-element-id='administration']";

    export const USER_ADMINISTRATION_WIDGET = "div[data-element-id='user-admin-widget-dialog']";

    export const GROUPS_ADMIN_WIDGET = "div[data-element-id='group-admin-widget-dialog']";

    export const STACK_ADMIN_WIDGET = "div[data-element-id='stack-admin-widget-dialog']";

    export const SYSTEMCONFIG_ADMIN_WIDGET = "div[data-element-id='systemconfig-admin-widget-dialog']";

    export const WARNING_DIALOG = "div[data-element-id='warning-dialog']";

    export const ACCEPT_BUTTON = "button[data-element-id='form-accept-button']";

    export const LOGOUT_BUTTON = "a[data-element-id='logout-button']";

    export const WIDGETS_BUTTON = "a[data-element-id='widgets-button']";

    export const WIDGETS_DIALOG = "div[data-element-id='widgets-dialog']";

    export const WIDGETS_SEARCH = "input[data-element-id='widget-search-field']";

    export const WIDGETS_SORT = "button[data-element-id='widget-sort']";

    export const WIDGET_DELETE_BUTTON = "button[data-element-id='widget-delete']";

    export const USER_AGREEMENT_LINK = "a[data-element-id='user-agreement-link']";

    export const USER_AGREEMENT = "div[data-element-id='user-agreement-dialog']";

    export const USER_AGREEMENT_BACK = "button[data-element-id='back-button']";

    export const STACKS_BUTTON = "button[data-element-id='stacks-button']";

    export const CLASSIFICATION_BANNER = "div[data-element-id='classification-banner'";

    export const EMPTY_PANEL = "div[class='mosaic-window-body'] > div";

    export const DIALOG_CLOSE = "button[aria-label='Close']";

    export const ADD_LAYOUT = "a[data-element-id='add-layout']";

    export const TABBED_LAYOUT_BUTTON = "a[data-element-id='tabbed-panel']";

    export const TABBED_PANEL = "div[class='bp3-tab-list']";
}

export namespace StackDialog {
    export const CREATE_DASHBOARD_BUTTON = "button[data-element-id='dashboard-create-button']";
    export const CREATE_STACK_BUTTON = "button[data-element-id='stack-create-button']";

    export const STACK_DIALOG = "div[data-element-id='stack-dialog']";

    export const CREATE_STACK_DIALOG = "a[data-element-id='CreateStackDialog']";
    export const CREATE_DASHBOARD_DIALOG = "a[data-element-id='CreateDashboardDialog']";

    export const STACK_LIST = "span[icon='chevron-right']:nth-of-type(1)";
    export const DASHBOARD = "li[class='bp3-tree-node']:nth-of-type(1)";

    export function getActionButtonsForStack(stackname: string): string {
        return `div[data-role="stack-actions"][data-name="${stackname}"]`;
    }

    export function getActionButtonsForDashboard(dashboardname: string): string {
        return `div[data-role="dashboard-actions"][data-name="${dashboardname}"]`;
    }

    export function getAddDashboardButtonForStack(stackname: string): string {
        return `${getActionButtonsForStack(stackname)} ${GlobalElements.STD_ADD_BUTTON}`;
    }

    export function getShareButtonForStack(stackname: string): string {
        return `${getActionButtonsForStack(stackname)} ${GlobalElements.STD_SHARE_BUTTON}`;
    }

    export function getRestoreButtonForStack(stackname: string): string {
        return `${getActionButtonsForStack(stackname)} ${GlobalElements.STD_RESTORE_BUTTON}`;
    }

    export function getEditButtonForStack(stackname: string): string {
        return `${getActionButtonsForStack(stackname)} ${GlobalElements.STD_EDIT_BUTTON}`;
    }

    export function getDeleteButtonForStack(stackname: string): string {
        return `${getActionButtonsForStack(stackname)} ${GlobalElements.STD_DELETE_BUTTON}`;
    }

    export function getRestoreButtonForDashboard(dashboardname: string): string {
        return `${getActionButtonsForDashboard(dashboardname)} ${GlobalElements.STD_RESTORE_BUTTON}`;
    }

    export function getEditButtonForDashboard(dashboardname: string): string {
        return `${getActionButtonsForDashboard(dashboardname)} ${GlobalElements.STD_EDIT_BUTTON}`;
    }

    export function getDeleteButtonForDashboard(dashboardname: string): string {
        return `${getActionButtonsForDashboard(dashboardname)} ${GlobalElements.STD_DELETE_BUTTON}`;
    }

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export namespace CreateStack {
        export const NAME_FIELD = "input[data-role='field'][name='name']";

        export const ICON_FIELD = "input[data-role='field'][name='iconImageUrl']";

        export const DESCRIPTION_FIELD = "input[data-role='field'][name='description']";

        export const PREMADE = "input[type='radio'][value='premade']";

        export const SELECT_PREMADE_LAYOUT = "label[class='bp3-control bp3-radio']:nth-of-type(1)";

        export const QUAD = "label[class='create-dashboard-screen_premadeLayoutOption__3-BMM']:nth-of-type(11)";

        export const COPY = "label[class='bp3-control bp3-radio']:nth-of-type(2)";

        export const COPY_DROPDOWN = "div[data-element-id='DashboardSelect']";

        export const FIRST_DASHBOARD = "select[data-element-id='Select'] option:nth-child(2)";

        export const NEW = "input[type='radio'][value='new']";

        export const SUBMIT = "button[data-element-id='form-submit-button']";

        export const DROPDOWN_CARET = "svg[data-icon='chevron-right']";

        export const CREATE_STACK_NAME = "test1";

        export const EDIT_STACK_NAME = "test2";

        export const CREATE_DASHBOARD_NAME = "testdash1";

        export const EDIT_DASHBOARD_NAME = "testdash2";

        export const COPY_DASHBOARD_NAME = "testdash3";
    }
}

export namespace LoginForm {
    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const PASSWORD_FIELD = "input[data-role='field'][name='password']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const SUCCESS_CALLOUT = "div[data-element-id='form-success-callout']";
}

export namespace AdminWidget {
    // TODO - Refactor further into namespaces
    export const USER_ADMIN_WIDGET_DIALOG = "div[data-element-id='user-admin-widget-dialog']";

    export const USER_ADMIN_CREATE_BUTTON = "button[data-element-id='user-admin-widget-create-button']";

    export const USER_ADMIN_BACK_BUTTON = `${USER_ADMIN_WIDGET_DIALOG} span[data-element-id='user-admin-widget-edit-back-button'] button`;

    // Widgets
    export const TAB_WIDGETS = `div[data-tab-id='user_widgets']`;
    export const ADD_BUTTON = "button[data-element-id='user-edit-add-user-dialog-add-button']";
    // End widgets

    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const FULL_NAME_FIELD = "input[data-role='field'][name='userRealName']";

    export const EMAIL_FIELD = "input[data-role='field'][name='email']";

    // Preferences
    export const NAMESPACE_FIELD = "input[data-role='field'][name='namespace']";

    export const PATH_FIELD = "input[data-role='field'][name='path']";

    export const VALUE_FIELD = "input[data-role='field'][name='value']";
    // end Preferences

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const EDIT_USER_ID = "button[data-element-id='user-admin-widget-edit-newUserEmail1@email.com']";

    export const EDIT_PREFERENCE_USER_ID = "button[data-element-id='user-admin-widget-edit-user@goss.com']";

    export const DELETE_USER_ID = "button[data-element-id='user-admin-widget-delete-newUserEmail1@email.com']";

    export function userTableActions(username: string): string {
        return `div[data-role="user-admin-widget-actions"][data-username="${username}"]`;
    }

    export function userTableEditButton(username: string): string {
        return `${userTableActions(username)} ${GlobalElements.STD_EDIT_BUTTON}`;
    }

    export const SEARCH_FIELD = "input[data-element-id='search-field']";

    export const PREFERENCES_TAB = "div[data-tab-id='user_preferences']";
}

export namespace StackAdminWidget {
    // DASHBOARD INITIAL PAGE & STATIC VALUES
    export const DIALOG = "div[data-element-id='stack-admin-widget-dialog']";
    export const GROUPS_TAB = "div[data-tab-id='dashboard_groups']";
    export const USERS_TAB = "div[data-tab-id='dashboard_users']";
    export const STACK_ADMIN_TEST_DASHBOARD_NAME = "DAW_Test";
    export const STACK_ADMIN_TEST_DASHBOARD_NAME_DEFAULT = "DAW_Test (default)";
    export const DASHBOARD_DIALOG_CLOSE = "button[aria-label='Close']";
    export const CLOSE_DAW_BUTTON = "button[title='Close Window']";
    export const ROW_BOX = "div[data-element-id='table-selector-dialog'] div[class='tabulator-table']";
    export const FIRST_ROW = `${ROW_BOX} > div:nth-child(1) div`;
    export const SECOND_ROW = `${ROW_BOX} > div:nth-child(2) div`;
    export const BACK_BUTTON = "span[data-element-id='stack-admin-widget-edit-back-button']";

    export function dashboardTableActions(dashboardname: string): string {
        return `div[data-role="stack-admin-widget-actions"][data-dashboardname="${dashboardname}"]`;
    }

    export function dashboardTableEditButton(dashboardname: string): string {
        return `${dashboardTableActions(dashboardname)} ${GlobalElements.STD_EDIT_BUTTON}`;
    }

    export function dashboardTableDeleteButton(dashboardname: string): string {
        return `${dashboardTableActions(dashboardname)} ${GlobalElements.STD_DELETE_BUTTON}`;
    }

    // GROUPS TAB
    export const ADD_GROUP_BUTTON = "button[data-element-id='group-edit-add-group-dialog-add-button']";
    export const FIRST_GROUP_NAME = "OWF Administrators";
    export const SECOND_GROUP_NAME = "OWF Users";

    export function dashboardGroupTableActions(groupname: string): string {
        return `div[data-role="stack-admin-widget-group-actions"][data-groupname="${groupname}"]`;
    }

    export function dashboardGroupTableDeleteButton(groupname: string): string {
        return `${dashboardGroupTableActions(groupname)} ${GlobalElements.STD_DELETE_BUTTON}`;
    }

    // USERS TAB
    export const ADD_USER_BUTTON = "button[data-element-id='user-edit-add-user-dialog-add-button']";
    export const FIRST_USERNAME = "admin";
    export const SECOND_USERNAME = "user";

    export function dashboardUserTableActions(username: string): string {
        return `div[data-role="stack-admin-widget-user-actions"][data-username="${username}"]`;
    }

    export function dashboardUserTableDeleteButton(username: string): string {
        return `${dashboardUserTableActions(username)} ${GlobalElements.STD_DELETE_BUTTON}`;
    }
}

export namespace SystemConfigAdminWidget {
    export namespace Main {
        export const DIALOG = "div[data-element-id='systemconfig-admin-widget-dialog']";
    }

    export namespace InputSelector {
        export const FIRST_TOGGLE = "div[data-element-type='toggleInput']";

        export const FIRST_STRING = "div[data-element-type='stringInput']";

        export const FIRST_INTEGER = "div[data-element-type='integerInput']";

        export const CUSTOM_BACKGROUND_URL = "div[data-element-id='InputFor_14']";

        export const CUSTOM_HEADER_URL = "div[data-element-id='InputFor_15']";

        export const CUSTOM_HEADER_HEIGHT = "div[data-element-id='InputFor_16']";

        export const CUSTOM_FOOTER_URL = "div[data-element-id='InputFor_17']";

        export const CUSTOM_FOOTER_HEIGHT = "div[data-element-id='InputFor_18']";

        export const CUSTOM_HEADFOOT_CSS = "div[data-element-id='InputFor_19']";

        export const CUSTOM_HEADFOOT_JS = "div[data-element-id='InputFor_20']";
    }

    export namespace InputTestValues {
        export const BACKGROUND_IMG_URL_VAL = "http://localhost:3000/images/widget-icons/ChannelShouter.png";

        export const HEADER_URL_VAL = "header.html";

        export const HEADER_HEIGHT_VAL = "100";

        export const FOOTER_URL_VAL = "footer.html";

        export const FOOTER_HEIGHT_VAL = "80";

        export const CSS_IMPORT_1_VAL = "test.css";

        export const CSS_IMPORT_2_VAL = "test2.css";

        export const JS_IMPORT_1_VAL = "test.js";

        export const JS_IMPORT_2_VAL = "test2.js";
    }

    export namespace TabSelector {
        export const TAB_AUDITING = "div[data-tab-id='auditing']";

        export const TAB_BRANDING = "div[data-tab-id='branding']";

        export const TAB_ACCOUNTS = "div[data-tab-id='accounts']";

        export const TAB_STORE = "div[data-tab-id='store']";
    }

    export namespace WidgetsUser {
        export const TAB = "div[data-element-id='user-admin-add-widget']";

        export const ADD_BUTTON = "button[data-element-id='user-edit-add-widget-dialog-add-button']";
    }

    export namespace UserPreferences {
        export const PREFERENCE_DIALOG = "div[data-element-id='user-admin-preference-dialog']";
    }
}

export namespace UserAdminWidget {
    export namespace Main {
        export const DIALOG = "div[data-element-id='user-admin-widget-dialog']";

        export const BACK_BUTTON = `${Main.DIALOG} span[data-element-id='user-admin-widget-edit-back-button'] button`;
    }

    export namespace PropertiesGroup {
        export const FORM = "div[data-element-id='user-admin-widget-edit-form']";

        export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";
    }

    export namespace EditUser {
        export const TAB_PROPERTIES = `div[data-tab-id='user_properties']`;

        export const TAB_WIDGETS = `div[data-tab-id='user_widgets']`;

        export const TAB_STACKS = `div[data-tab-id='user_stacks']`;
    }

    export namespace WidgetsUser {
        export const TAB = "div[data-element-id='user-admin-add-widget']";

        export const ADD_BUTTON = "button[data-element-id='user-edit-add-widget-dialog-add-button']";
    }

    export namespace StacksUser {
        export const ADD_BUTTON = "button[data-element-id='user-edit-add-stack-dialog-add-button']";
    }

    export namespace UserPreferences {
        export const PREFERENCE_DIALOG = "div[data-element-id='user-admin-preference-dialog']";
    }
}

export namespace GroupAdminWidget {
    export namespace Main {
        export const DIALOG = "div[data-element-id='group-admin-widget-dialog']";

        export const SEARCH_FIELD = `${Main.DIALOG} input[data-element-id='search-field']`;

        export const CREATE_BUTTON = `${Main.DIALOG} button[data-element-id='group-admin-widget-create-button']`;

        export const BACK_BUTTON = `${Main.DIALOG} span[data-element-id='group-admin-widget-edit-back-button'] button`;
    }

    export namespace GroupProperties {
        export const FORM = "div[data-element-id='group-admin-widget-edit-form']";

        export const NAME_INPUT = `${GroupProperties.FORM} input[name='name']`;

        export const DISPLAY_NAME_INPUT = `${GroupProperties.FORM} input[name='displayName']`;

        export const DESCRIPTION_INPUT = `${GroupProperties.FORM} input[name='description']`;

        export const SUBMIT_BUTTON =
            "div[data-element-id='group-admin-widget-edit-submit-button'] > button[data-element-id='form-submit-button']";
    }

    export namespace EditGroup {
        export const TAB_PROPERTIES = `div[data-tab-id='group_properties']`;

        export const TAB_USERS = `div[data-tab-id='group_users']`;

        export const TAB_WIDGETS = `div[data-tab-id='group_widgets']`;

        export const TAB_STACKS = `div[data-tab-id='group_stacks']`;
    }

    export namespace PropertiesGroup {
        export const FORM = "div[data-element-id='group-admin-widget-edit-form']";

        export const NAME_INPUT = `${PropertiesGroup.FORM} input[name='name']`;

        export const SUBMIT_BUTTON =
            "div[data-element-id='group-admin-widget-edit-submit-button'] > button[data-element-id='form-submit-button']";
    }

    export namespace UsersGroup {
        export const TAB = "div[data-element-id='group-admin-add-user']";

        export const ADD_BUTTON = "button[data-element-id='group-edit-add-user-dialog-add-button']";
    }

    export namespace WidgetsGroup {
        export const TAB = "div[data-element-id='group-admin-add-widget']";

        export const ADD_BUTTON = "button[data-element-id='group-edit-add-widget-dialog-add-button']";
    }

    export namespace StacksGroup {
        export const TAB = "div[data-element-id='group-admin-add-stack']";

        export const ADD_BUTTON = "button[data-element-id='group-edit-add-stack-dialog-add-button']";
    }
}

export namespace WidgetAdminWidget {
    export namespace Main {
        export const DIALOG = "div[data-element-id='widget-admin-widget-dialog']";

        export const SEARCH_FIELD = `${Main.DIALOG} input[data-element-id='search-field']`;

        export const CREATE_BUTTON = `${Main.DIALOG} button[data-element-id='widget-admin-widget-create-button']`;

        export const BACK_BUTTON = `${Main.DIALOG} span[data-element-id='widget-admin-widget-edit-back-button'] button`;
    }

    export namespace CreateWidget {
        export const FORM = "div[data-element-id='widget-admin-widget-properties-form']";

        export const NAME_INPUT = `${CreateWidget.FORM} input[name='displayName']`;

        export const DESCRIPTION_INPUT = `${CreateWidget.FORM} input[name='description']`;

        export const VERSION_INPUT = `${CreateWidget.FORM} input[name='widgetVersion']`;

        export const UNIVERSAL_NAME_INPUT = `${CreateWidget.FORM} input[name='universalName']`;

        export const URL_INPUT = `${CreateWidget.FORM} input[name='widgetUrl']`;

        export const SMALL_ICON_INPUT = `${CreateWidget.FORM} input[name='imageUrlSmall']`;

        export const MEDIUM_ICON_INPUT = `${CreateWidget.FORM} input[name='imageUrlMedium']`;

        export const WIDTH_INPUT = `${CreateWidget.FORM} input[name='width']`;

        export const HEIGHT_INPUT = `${CreateWidget.FORM} input[name='height']`;

        export const WIDGET_TYPE_BUTTON = `${CreateWidget.FORM} button[name='widgetType']`;

        export const SHOW_CREATE_FORM = "a[data-element-id='widget-admin-widget-show-properties-form']";

        export const SUBMIT_BUTTON =
            "div[data-element-id='admin-widget-properties-submit-button'] > button[data-element-id='form-submit-button']";
    }

    export namespace PropertiesGroup {
        export const FORM = "div[data-element-id='widget-admin-widget-properties-form']";

        export const NAME_INPUT = `${PropertiesGroup.FORM} input[name='displayName']`;

        export const SUBMIT_BUTTON =
            "div[data-element-id='widget-admin-widget-edit-submit-button'] > button[data-element-id='form-submit-button']";
    }

    export namespace ExportDialog {
        export const FORM = "form[data-element-id='export-dialog-form']";

        export const FILENAME_INPUT = `${ExportDialog.FORM} input[name='filename']`;
    }
}

export namespace GlobalElements {
    export const CONFIRMATION_DIALOG = "div[data-element-id='confirmation-dialog']";

    export const CONFIRMATION_DIALOG_CONFIRM_BUTTON = `button[data-element-id='confirmation-dialog-confirm']`;

    export const GENERIC_TABLE_SELECTOR_DIALOG = "div[data-element-id='table-selector-dialog']";

    export const GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON = "button[data-element-id='table-selector-confirm']";

    export const GENERIC_TABLE_ADD_SEARCH_FIELD = `${GENERIC_TABLE_SELECTOR_DIALOG} input[data-element-id='search-field']`;

    export const STD_ADD_BUTTON = "a[data-element-id='add-button']";

    export const STD_SHARE_BUTTON = "a[data-element-id='share-button']";

    export const STD_RESTORE_BUTTON = "a[data-element-id='restore-button']";

    export const STD_EDIT_BUTTON = "a[data-element-id='edit-button']";

    export const STD_EDIT_MENU_BUTTON = "button[data-element-id='edit-menu-button']";

    export const STD_DELETE_BUTTON = "a[data-element-id='delete-button']";

    export const CUSTOM_BACKGROUND_IMAGE = "div[data-element-id='custom-background-image']";

    export const CUSTOM_HEADER = "div[data-element-id='sysconfig-custom-header']";

    export const CUSTOM_FOOTER = "div[data-element-id='sysconfig-custom-footer']";

    export const CUSTOM_CSS = "link[id='custom-added-css']";

    export const CUSTOM_JS = "script[id='custom-added-js']";

    export const SPINNER = "div.bp3-spinner";
}
