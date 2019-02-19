export namespace MainPage {
    export const LOGIN_BUTTON = "button[data-element-id='login-button']";

    export const LOGIN_DIALOG = "div[data-element-id='login-dialog']";

    export const USER_MENU_BUTTON = "button[data-element-id='user-menu-button']";

    export const USER_MENU = "ul[data-element-id='user-menu']";

    export const ABOUT_BUTTON = "a[data-element-id='about-button']";

    export const ABOUT_DIALOG = "div[data-element-id='about-dialog']";

    export const ADMINISTRATION_BUTTON = "a[data-element-id='administration']";

    export const ADMINISTRATION_MENU = "div[data-element-id='administration']";

    export const WIDGETS_MENU_ADMIN_BUTTON = "div[data-element-id='Widgets']";

    export const USER_MENU_ADMIN_BUTTON = "div[data-element-id='Users']";

    export const USER_ADMINISTRATION_WIDGET = "div[data-element-id='user-admin-widget-dialog']";

    export const GROUPS_ADMIN_BUTTON = "div[data-element-id='Groups']";

    export const GROUPS_ADMIN_WIDGET = "div[data-element-id='group-admin-widget-dialog']";

    export const WARNING_DIALOG = "div[data-element-id='warning-dialog']";

    export const ACCEPT_BUTTON = "button[data-element-id='form-accept-button']";

    export const LOGOUT_BUTTON = "a[data-element-id='logout-button']";

    export const WIDGETS_BUTTON = "button[data-element-id='widgets-button']";

    export const WIDGETS_DIALOG = "div[data-element-id='widgets-dialog']";

    export const WIDGETS_SEARCH = "input[data-element-id='widget-search-field']";

    export const WIDGETS_SORT_ASC = "button[data-element-id='widget-sort-ascending']";

    export const WIDGETS_SORT_DSC = "button[data-element-id='widget-sort-descending']";

    export const USER_AGREEMENT_LINK = "a[data-element-id='user-agreement-link']";

    export const USER_AGREEMENT = "div[data-element-id='user-agreement-dialog']";

    export const USER_AGREEMENT_BACK = "button[data-element-id='back-button']";

    export const DASHBOARD_BUTTON = "button[data-element-id='dashboards-button']";

    export const CREATE_DASHBOARD_BUTTON = "button[data-element-id='CreateDashboardButton']";

    export const CREATE_DASHBOARD_DIALOG = "a[data-element-id='CreateDashboardDialog']";

    export const CLASSIFICATION_BANNER = "div[data-element-id='classification-banner'";
}

export namespace CreateDashboardDialog {
    export const NAME_FIELD = "input[data-role='field'][name='name']";

    export const ICON_FIELD = "input[data-role='field'][name='iconImageUrl']";

    export const DESCRIPTION_FIELD = "input[data-role='field'][name='description']";

    export const PREMADE = "input[type='radio'][value='premade']";

    export const SELECT_PREMADE_LAYOUT = "div[data-element-id='PremadeLayoutsList']";

    export const COPY = "input[type='radio'][value='copy']";

    export const COPY_DROPDOWN = "div[data-element-id='DashboardSelect']";

    export const NEW = "input[type='radio'][value='new']";

    export const SUBMIT = "button[data-element-id='form-submit-button']";
}

export namespace LoginForm {
    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const PASSWORD_FIELD = "input[data-role='field'][name='password']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const SUCCESS_CALLOUT = "div[data-element-id='form-success-callout']";
}

export namespace AdminWidget {
    export const USER_ADMIN_WIDGET_DIALOG = "div[data-element-id='user-admin-widget-dialog']";

    export const USER_ADMIN_CREATE_BUTTON = "button[data-element-id='user-admin-widget-create-button']";

    export const USER_ADMIN_BACK_BUTTON = `${USER_ADMIN_WIDGET_DIALOG} span[data-element-id='user-admin-widget-edit-back-button'] button`;

    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const FULL_NAME_FIELD = "input[data-role='field'][name='userRealName']";

    export const EMAIL_FIELD = "input[data-role='field'][name='email']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const EDIT_USER_ID = "button[data-element-id='user-admin-widget-edit-newUserEmail1@email.com']";

    export const DELETE_USER_ID = "button[data-element-id='user-admin-widget-delete-newUserEmail1@email.com']";

    export const CONFIRM_DELETE_ALERT = "div.delete-user-alert";

    export const CONFIRM_DELETE_BUTTON = "div.delete-user-alert > div.bp3-alert-footer > button.bp3-intent-danger";

    export const SEARCH_FIELD = "input[data-element-id='search-field']";
}

export namespace GroupAdminWidget {
    export namespace Main {
        export const DIALOG = "div[data-element-id='group-admin-widget-dialog']";

        export const SEARCH_FIELD = `${Main.DIALOG} input[data-element-id='search-field']`;

        export const CREATE_BUTTON = `${Main.DIALOG} button[data-element-id='group-admin-widget-create-button']`;

        export const BACK_BUTTON = `${Main.DIALOG} span[data-element-id='group-admin-widget-edit-back-button'] button`;
    }

    export namespace CreateGroup {
        export const FORM = "div[data-element-id='group-admin-widget-create-form']";

        export const NAME_INPUT = `${CreateGroup.FORM} input[name='name']`;

        export const DISPLAY_NAME_INPUT = `${CreateGroup.FORM} input[name='displayName']`;

        export const DESCRIPTION_INPUT = `${CreateGroup.FORM} input[name='description']`;

        export const SUBMIT_BUTTON =
            "div[data-element-id='group-admin-widget-create-submit-button'] > button[data-element-id='form-submit-button']";
    }

    export namespace EditGroup {
        export const TAB_PROPERTIES = `div[data-tab-id='group_properties']`;

        export const TAB_USERS = `div[data-tab-id='group_users']`;
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
}

export namespace WidgetAdminWidget {
    export namespace Main {
        export const DIALOG = "div[data-element-id='widget-admin-widget-dialog']";

        export const SEARCH_FIELD = `${Main.DIALOG} input[data-element-id='search-field']`;

        export const CREATE_BUTTON = `${Main.DIALOG} button[data-element-id='widget-admin-widget-create-button']`;

        export const BACK_BUTTON = `${Main.DIALOG} span[data-element-id='group-admin-widget-edit-back-button'] button`;
    }
}

export namespace GlobalElements {
    export const CONFIRMATION_DIALOG = "div[data-element-id='confirmation-dialog']";

    export const CONFIRMATION_DIALOG_CONFIRM_BUTTON = `button[data-element-id='confirmation-dialog-confirm'] `;

    export const GENERIC_TABLE_SELECTOR_DIALOG = "div[data-element-id='table-selector-dialog']";

    export const GENERIC_TABLE_SELECTOR_DIALOG_OK_BUTTON = "button[data-element-id='table-selector-confirm']";
}
