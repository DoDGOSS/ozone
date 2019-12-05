import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { themeApi } from "../api/clients/ThemeAPI";
import { DARK_THEME } from "../constants";
import { isBlank } from "../utility";

export class MainStore {
    private readonly themeClass$ = new BehaviorSubject(DARK_THEME);
    private readonly storeUrl$ = new BehaviorSubject("");

    private readonly isAboutVisible$ = new BehaviorSubject(false);
    private readonly isAdminToolsDialogOpen$ = new BehaviorSubject(false);
    private readonly isStoreOpen$ = new BehaviorSubject(false);
    private readonly storeShouldRefresh$ = new BehaviorSubject(true);
    private readonly isCreateStackDialogVisible$ = new BehaviorSubject(false);
    private readonly isStackDialogVisible$ = new BehaviorSubject(false);
    private readonly isHelpDialogVisible$ = new BehaviorSubject(false);
    private readonly isUserProfileDialogVisible$ = new BehaviorSubject(false);
    private readonly isWidgetSwitcherVisible$ = new BehaviorSubject(false);
    private readonly isWidgetToolbarOpen$ = new BehaviorSubject(false);

    themeClass = () => asBehavior(this.themeClass$);
    getTheme = () => this.themeClass$.value;
    setTheme = (newTheme: string | undefined) => this.themeClass$.next(newTheme ? newTheme : "");
    updateTheme = async (newTheme: string) => {
        const result = await themeApi.setTheme(newTheme);
        this.setTheme(result);
    };
    toggleTheme = () => this.updateTheme(isBlank(this.themeClass$.value) ? DARK_THEME : "");

    isStackDialogVisible = () => asBehavior(this.isStackDialogVisible$);
    showStackDialog = () => this.isStackDialogVisible$.next(true);
    hideStackDialog = () => this.isStackDialogVisible$.next(false);

    isWidgetToolbarOpen = () => asBehavior(this.isWidgetToolbarOpen$);
    showWidgetToolbar = () => this.isWidgetToolbarOpen$.next(true);
    closeWidgetToolbar = () => this.isWidgetToolbarOpen$.next(false);
    toggleWidgetToolbar = () => this.isWidgetToolbarOpen$.next(!this.isWidgetToolbarOpen$.value);

    isWidgetSwitcherVisible = () => asBehavior(this.isWidgetSwitcherVisible$);
    showWidgetSwitcher = () => this.isWidgetSwitcherVisible$.next(true);
    hideWidgetSwitcher = () => this.isWidgetSwitcherVisible$.next(false);

    isAboutVisible = () => asBehavior(this.isAboutVisible$);
    showAboutDialog = () => this.isAboutVisible$.next(true);
    hideAboutDialog = () => this.isAboutVisible$.next(false);

    isCreateStackDialogVisible = () => asBehavior(this.isCreateStackDialogVisible$);
    showCreateStackDialog = () => this.isCreateStackDialogVisible$.next(true);
    hideCreateStackDialog = () => this.isCreateStackDialogVisible$.next(false);

    isStoreOpen = () => asBehavior(this.isStoreOpen$);
    showStore = () => this.isStoreOpen$.next(true);
    hideStore = () => this.isStoreOpen$.next(false);
    toggleStore = () => this.isStoreOpen$.next(!this.isStoreOpen$.value);

    storeShouldRefresh = () => asBehavior(this.storeShouldRefresh$);
    refreshStore = () => this.storeShouldRefresh$.next(true);
    storeHasRefreshed = () => this.storeShouldRefresh$.next(false);

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
