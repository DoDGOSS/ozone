import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { themeApi } from "../api/clients/ThemeAPI";

import { isBlank } from "../utility";

import { DARK_THEME } from "../constants";

export class MainStore {
    private readonly themeClass$ = new BehaviorSubject(DARK_THEME);

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

    themeClass = () => asBehavior(this.themeClass$);

    getTheme = () => this.themeClass$.value;

    setTheme = (newTheme: string) => {
        this.themeClass$.next(newTheme);
    };

    updateTheme = async (newTheme: string) => {
        const result = await themeApi.setTheme(newTheme);
        this.themeClass$.next(result.data);
    };

    toggleTheme = () => {
        this.updateTheme(isBlank(this.themeClass$.value) ? DARK_THEME : "");
    };

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
}

export const mainStore = new MainStore();