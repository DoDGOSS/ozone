import { action, observable, runInAction } from "mobx";
import { injectable } from "../inject";


@injectable()
export class MainStore {

    @observable
    isLoginDialogOpen: boolean;

    @observable
    isWarningDialogVisible: boolean;

    @observable
    isHelpDialogVisible: boolean;

    @observable
    isAdminToolsDialogOpen: boolean;

    @observable
    isDashboardDialogVisible: boolean;

    @observable
    isUserProfileDialogVisible: boolean;

    @observable
    isWidgetToolbarOpen: boolean;

    @observable
    widgetFilter: string | undefined;


    constructor() {
        runInAction("initialize", () => {
            this.isWarningDialogVisible = false;
            this.isHelpDialogVisible = false;
            this.isUserProfileDialogVisible = false;
            this.isAdminToolsDialogOpen = false;
            this.isDashboardDialogVisible = false;
            this.isWidgetToolbarOpen = false;
        });
    }

    @action.bound
    showLoginDialog() {
        this.isLoginDialogOpen = true;
    }

    @action.bound
    hideLoginDialog() {
        this.isLoginDialogOpen = false;
    }

    @action.bound
    showWarningDialog() {
        this.isWarningDialogVisible = true;
    }

    @action.bound
    hideWarningDialog() {
        this.isWarningDialogVisible = false;
    }

    @action.bound
    showHelpDialog() {
        this.isHelpDialogVisible = true;
    }

    @action.bound
    showUserProfileDialog() {
        this.isUserProfileDialogVisible = true;
    }

    @action.bound
    hideUserProfileDialog() {
        this.isUserProfileDialogVisible = false;
    }

    @action.bound
    hideHelpDialog() {
        this.isHelpDialogVisible = false;
    }

    @action.bound
    showAdminToolsDialog() {
        this.isAdminToolsDialogOpen = true;
    }

    @action.bound
    hideAdminToolsDialog() {
        this.isAdminToolsDialogOpen = false;
    }

    @action.bound
    showDashboardDialog() {
        this.isDashboardDialogVisible = true;
    }

    @action.bound
    hideDashboardDialog() {
        this.isDashboardDialogVisible = false;
    }

    @action.bound
    closeWidgetToolbar() {
        this.isWidgetToolbarOpen = false;
    }

    @action.bound
    toggleWidgetToolbar() {
        this.isWidgetToolbarOpen = !this.isWidgetToolbarOpen;
    }

    @action.bound
    setWidgetFilter(value: string) {
        this.widgetFilter = value;
    }

}
