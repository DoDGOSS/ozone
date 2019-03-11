import { BehaviorSubject } from "rxjs";

import { asBehavior } from "../observables";
import { isBlank } from "../utility";
import { preferenceApi } from "../api/clients/PreferenceAPI";


export class MainStore {
    private readonly themeClass$ = new BehaviorSubject("bp3-dark");

    private readonly isAboutVisible$ = new BehaviorSubject(false);
    private readonly isAdminToolsDialogOpen$ = new BehaviorSubject(false);
    private readonly isCreateDashboardDialogVisible$ = new BehaviorSubject(false);
    private readonly isDashboardDialogVisible$ = new BehaviorSubject(false);
    private readonly isHelpDialogVisible$ = new BehaviorSubject(false);
    private readonly isLoginDialogOpen$ = new BehaviorSubject(false);
    private readonly isUserAgreementVisible$ = new BehaviorSubject(false);
    private readonly isUserProfileDialogVisible$ = new BehaviorSubject(false);
    private readonly isWarningDialogVisible$ = new BehaviorSubject(false);
    private readonly isWidgetToolbarOpen$ = new BehaviorSubject(false);
    private readonly widgetFilter$ = new BehaviorSubject<string | null>(null);

    themeClass = () => asBehavior(this.themeClass$);
    toggleTheme = () => {
        this.setTheme(isBlank(this.themeClass$.value) ? "bp3-dark" : "")
	};
    setTheme = (newTheme: string) => {
		// make sure no one's trying to use this css class to inject something nefarious.
		// Mixed claims about whether it's possible, but it doesn't hurt to check.
		// https://stackoverflow.com/questions/5855398/user-defined-css-what-can-go-wrong
		newTheme = isBlank(newTheme) ? "" : "bp3-dark";

		this.themeClass$.next(newTheme);
		preferenceApi.updatePreference({namespace: 'owf', path: 'selected_theme', value: newTheme})
    };
	getTheme = () => this.themeClass$.value;

    isDashboardDialogVisible = () => asBehavior(this.isDashboardDialogVisible$);
    showDashboardDialog = () => this.isDashboardDialogVisible$.next(true);
    hideDashboardDialog = () => this.isDashboardDialogVisible$.next(false);

    isWidgetToolbarOpen = () => asBehavior(this.isWidgetToolbarOpen$);
    closeWidgetToolbar = () => this.isWidgetToolbarOpen$.next(false);
    toggleWidgetToolbar = () => this.isWidgetToolbarOpen$.next(!this.isWidgetToolbarOpen$.value);

    isAboutVisible = () => asBehavior(this.isAboutVisible$);
    showAboutDialog = () => this.isAboutVisible$.next(true);
    hideAboutDialog = () => this.isAboutVisible$.next(false);

    isCreateDashboardDialogVisible = () => asBehavior(this.isCreateDashboardDialogVisible$);
    showCreateDashboardDialog = () => this.isCreateDashboardDialogVisible$.next(true);
    hideCreateDashboardDialog = () => this.isCreateDashboardDialogVisible$.next(false);

    isLoginDialogOpen = () => asBehavior(this.isLoginDialogOpen$);
    showLoginDialog = () => this.isLoginDialogOpen$.next(true);
    hideLoginDialog = () => this.isLoginDialogOpen$.next(false);

    isWarningDialogVisible = () => asBehavior(this.isWarningDialogVisible$);
    showWarningDialog = () => this.isWarningDialogVisible$.next(true);
    hideWarningDialog = () => this.isWarningDialogVisible$.next(false);

    isUserAgreementVisible = () => asBehavior(this.isUserAgreementVisible$);
    showUserAgreement = () => this.isUserAgreementVisible$.next(true);
    hideUserAgreement = () => this.isUserAgreementVisible$.next(false);

    isHelpDialogVisible = () => asBehavior(this.isHelpDialogVisible$);
    showHelpDialog = () => this.isHelpDialogVisible$.next(true);
    hideHelpDialog = () => this.isHelpDialogVisible$.next(false);

    isUserProfileDialogVisible = () => asBehavior(this.isUserProfileDialogVisible$);
    showUserProfileDialog = () => this.isUserProfileDialogVisible$.next(true);
    hideUserProfileDialog = () => this.isUserProfileDialogVisible$.next(false);

    isAdminToolsDialogOpen = () => asBehavior(this.isAdminToolsDialogOpen$);
    showAdminToolsDialog = () => this.isAdminToolsDialogOpen$.next(true);
    hideAdminToolsDialog = () => this.isAdminToolsDialogOpen$.next(false);

    widgetFilter = () => asBehavior(this.widgetFilter$);
    setWidgetFilter = (value: string) => this.widgetFilter$.next(value);
    clearWidgetFilter = () => this.widgetFilter$.next(null);
}

export const mainStore = new MainStore();
