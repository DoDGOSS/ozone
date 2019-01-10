export namespace MainPage {

    export const LOGIN_BUTTON = "button[data-element-id='login-button']";

    export const LOGIN_DIALOG = "div[data-element-id='login-dialog']";

    export const USER_MENU_BUTTON = "button[data-element-id='user-menu-button']";

}

export namespace LoginForm {

    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const PASSWORD_FIELD = "input[data-role='field'][name='password']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const SUCCESS_CALLOUT = "div[data-element-id='form-success-callout']";


}

export namespace AdminWidgets {

  //Group Admin Widget
  export const GROUP_ADMIN_WIDGET_DIALOG = "div[data-element-id='group-admin-widget-dialog']";

}

export namespace AdminWidget {

    export const USER_ADMIN_WIDGET_DIALOG = "div[data-element-id='user-admin-widget-dialog']";

    export const GROUP_ADMIN_WIDGET_DIALOG = "div[data-element-id='group-admin-widget-dialog']";

    export const USER_ADMIN_CREATE_BUTTON = "button[data-element-id='user-admin-widget-create-button']";

    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const FULL_NAME_FIELD = "input[data-role='field'][name='userRealName']";

    export const EMAIL_FIELD = "input[data-role='field'][name='email']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const EDIT_USER_ID = "button[data-element-id='user-admin-widget-edit-newUserEmail1@email.com']";

    export const DELETE_USER_ID = "button[data-element-id='user-admin-widget-delete-newUserEmail1@email.com']";

    export const CONFIRM_DELETE_ALERT = "div.delete-user-alert";

    export const CONFIRM_DELETE_BUTTON = "div.delete-user-alert > div.bp3-alert-footer > button.bp3-intent-danger";

}
