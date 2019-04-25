export namespace AdminWidgetsDialog {
    export const WIDGETS_MENU_ADMIN_BUTTON = "div[data-element-id='Widget Administration']";

    export const USER_MENU_ADMIN_BUTTON = "div[data-element-id='User Administration']";

    export const DASHBOARDS_MENU_ADMIN_BUTTON = "div[data-element-id='Dashboard Administration']";

    export const GROUPS_ADMIN_BUTTON = "div[data-element-id='Group Administration']";
}

export namespace MainPage {
    export const LOGIN_BUTTON = "button[data-element-id='login-button']";

    export const LOGIN_DIALOG = "div[data-element-id='login-dialog']";

    export const USER_MENU_BUTTON = "button[data-element-id='user-menu-button']";

    export const USER_MENU = "ul[data-element-id='user-menu']";

    export const ABOUT_BUTTON = "a[data-element-id='about-button']";

    export const ABOUT_DIALOG = "div[data-element-id='about-dialog']";

    export const ADMINISTRATION_BUTTON = "a[data-element-id='administration']";

    export const ADMINISTRATION_MENU = "div[data-element-id='administration']";

    export const USER_ADMINISTRATION_WIDGET = "div[data-element-id='user-admin-widget-dialog']";

    export const GROUPS_ADMIN_WIDGET = "div[data-element-id='group-admin-widget-dialog']";

    export const DASHBOARD_ADMIN_WIDGET = "div[data-element-id='dashboard-admin-widget-dialog']";

    export const WARNING_DIALOG = "div[data-element-id='warning-dialog']";

    export const ACCEPT_BUTTON = "button[data-element-id='form-accept-button']";

    export const LOGOUT_BUTTON = "a[data-element-id='logout-button']";

    export const WIDGETS_BUTTON = "button[data-element-id='widgets-button']";

    export const WIDGETS_DIALOG = "div[data-element-id='widgets-dialog']";

    export const WIDGETS_SEARCH = "input[data-element-id='widget-search-field']";

    export const WIDGETS_SORT = "button[data-element-id='widget-sort']";

    export const WIDGET_DELETE_BUTTON = "button[data-element-id='widget-delete']";

    export const USER_AGREEMENT_LINK = "a[data-element-id='user-agreement-link']";

    export const USER_AGREEMENT = "div[data-element-id='user-agreement-dialog']";

    export const USER_AGREEMENT_BACK = "button[data-element-id='back-button']";

    export const DASHBOARD_BUTTON = "button[data-element-id='dashboards-button']";

    export const CLASSIFICATION_BANNER = "div[data-element-id='classification-banner'";
}

export namespace DashboardDialog {
    export const CREATE_DASHBOARD_BUTTON = "button[data-element-id='dashboard-create-button']";

    export const DASHBOARD_DIALOG = "div[data-element-id='dashboard-dialog']";

    export const CREATE_DASHBOARD_DIALOG = "a[data-element-id='CreateDashboardDialog']";

    export const EDIT_DASHBOARD_ID = "button[data-element-id='dashboard-edit-button-test1']";

    export const DELETE_DASHBOARD_ID = "button[data-element-id='dashboard-delete-button-test2']";

    export const SHARE_DASHBOARD_ID = "button[data-element-id='dashboard-share-button-test2']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export function shareDashboardByName(dashboardname: string): string {
        return `button[data-element-id="dashboard-share-button-${dashboardname}"]`;
    }

    export namespace CreateDashboard {
        export const NAME_FIELD = "input[data-role='field'][name='name']";

        export const ICON_FIELD = "input[data-role='field'][name='iconImageUrl']";

        export const DESCRIPTION_FIELD = "input[data-role='field'][name='description']";

        export const PREMADE = "input[type='radio'][value='premade']";

        export const SELECT_PREMADE_LAYOUT = "div[data-element-id='PremadeLayoutsList']";

        export const COPY = "input[type='radio'][value='copy']";

        export const COPY_DROPDOWN = "div[data-element-id='DashboardSelect']";

        export const NEW = "input[type='radio'][value='new']";

        export const SUBMIT = "button[data-element-id='form-submit-button']";

        export const CREATE_DASHBOARD_NAME = "test1";

        export const EDIT_DASHBOARD_NAME = "test2";
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

    export const EDIT_PREFERENCE_USER_ID = "button[data-element-id='user-admin-widget-edit-testUser1@ozone.test']";

    export const DELETE_USER_ID = "button[data-element-id='user-admin-widget-delete-newUserEmail1@email.com']";

    export function userTableActions(username: string): string {
        return `div[data-role="user-admin-widget-actions"][data-username="${username}"]`;
    }

    export function userTableEditButton(username: string): string {
        return `${userTableActions(username)} button[data-element-id="edit-button"]`;
    }

    export const CONFIRM_DELETE_ALERT = "div.delete-user-alert";

    export const CONFIRM_DELETE_BUTTON = "div.delete-user-alert > div.bp3-alert-footer > button.bp3-intent-danger";

    export const SEARCH_FIELD = "input[data-element-id='search-field']";

    export const PREFERENCES_TAB = "div[data-tab-id='user_preferences']";
}

export namespace DashboardAdminWidget {
    // DASHBOARD INITIAL PAGE & STATIC VALUES
    export const DIALOG = "div[data-element-id='dashboard-admin-widget-dialog']";
    export const GROUPS_TAB = "div[data-tab-id='dashboard_groups']";
    export const DASHBOARD_ADMIN_TEST_DASHBOARD_NAME = "DAW_Test";
    export const DASHBOARD_DIALOG_CLOSE = "button[aria-label='Close'";
    export const CLOSE_DAW_BUTTON = "button[title='Close Window']";

    export function dashboardTableActions(dashboardname: string): string {
        return `div[data-role="dashboard-admin-widget-actions"][data-dashboardname="${dashboardname}"]`;
    }

    export function dashboardTableEditButton(dashboardname: string): string {
        return `${dashboardTableActions(dashboardname)} button[data-element-id="dashboard-admin-widget-edit-button"]`;
    }

    export function dashboardTableDeleteButton(dashboardname: string): string {
        return `${dashboardTableActions(dashboardname)} button[data-element-id="dashboard-admin-widget-delete-button"]`;
    }

    // GROUPS TAB
    export const ADD_GROUP_BUTTON = "button[data-element-id='group-edit-add-group-dialog-add-button']";
    export const ROW_BOX = "div[data-element-id='table-selector-dialog'] div[class='rt-tbody']";
    export const FIRST_GROUP_NAME = "OWF Administrators";
    export const SECOND_GROUP_NAME = "OWF Users";
    export const FIRST_GROUP = `${ROW_BOX} > div:nth-child(1) div`;
    export const SECOND_GROUP = `${ROW_BOX} > div:nth-child(2) div`;
    export const BACK_BUTTON = "span[data-element-id='dashboard-admin-widget-edit-back-button']";

    export function dashboardGroupTableActions(groupname: string): string {
        return `div[data-role="dashboard-admin-widget-group-actions"][data-groupname="${groupname}"]`;
    }

    export function dashboardGroupTableDeleteButton(groupname: string): string {
        return `${dashboardGroupTableActions(
            groupname
        )} button[data-element-id="dashboard-admin-widget-delete-group-button"]`;
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
    }

    export namespace WidgetsUser {
        export const TAB = "div[data-element-id='user-admin-add-widget']";

        export const ADD_BUTTON = "button[data-element-id='user-edit-add-widget-dialog-add-button']";
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
}

export namespace GlobalElements {
    export const CONFIRMATION_DIALOG = "div[data-element-id='confirmation-dialog']";

    export const CONFIRMATION_DIALOG_CONFIRM_BUTTON = `button[data-element-id='confirmation-dialog-confirm']`;

    export const GENERIC_TABLE_SELECTOR_DIALOG = "div[data-element-id='table-selector-dialog']";

    export const GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON = "button[data-element-id='table-selector-confirm']";

    export const GENERIC_TABLE_ADD_SEARCH_FIELD = "input[data-element-id='table-selector-search-field']";
}
