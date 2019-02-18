import { action, observable, runInAction } from "mobx";
import { injectable } from "../inject";

@injectable()
export class MainStore {

    @observable
    isConfrimationTrue:boolean;

    @observable
    isConfirmationDialogVisible:boolean;

    @observable
    isCreateDashboardDialogVisible: boolean;

    @observable
    isLoginDialogOpen: boolean;

    @observable
    isWarningDialogVisible: boolean;

    @observable
    isUserAgreementVisible: boolean;

    @observable
    isAboutVisible: boolean;

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
    darkTheme: boolean;

    @observable
    darkClass:string;

    @observable
    widgetFilter: string | undefined;

    constructor() {
        runInAction("initialize", () => {
            this.isConfrimationTrue = false;
            this.isConfirmationDialogVisible = false;
            this.isCreateDashboardDialogVisible = false;
            this.isAboutVisible=false;
            this.isWarningDialogVisible = false;
            this.isUserAgreementVisible = false;
            this.isHelpDialogVisible = false;
            this.isUserProfileDialogVisible = false;
            this.isAdminToolsDialogOpen = false;
            this.isDashboardDialogVisible = false;
            this.isWidgetToolbarOpen = false;
            this.darkTheme = false;
        });
    }

    @action.bound
    showConfirmationDialog() {
        this.isConfirmationDialogVisible = true;
        this.isConfrimationTrue=false;
    }

    @action.bound
    hideConfirmationDialogCancel() {
        this.isConfirmationDialogVisible = false;
    }

    @action.bound
    hideConfirmationDialogConfirm() {
        this.isConfirmationDialogVisible = false;
        this.isConfrimationTrue=true;
    }



    @action.bound
    showCreateDashboardDialog() {
        this.isCreateDashboardDialogVisible = true;
    }

    @action.bound
    hideCreateDashboardDialog() {
        this.isCreateDashboardDialogVisible = false;
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
    showAboutDialog() {
        this.isAboutVisible=true;
    }

    @action.bound
    hideAboutDialog() {
        this.isAboutVisible=false;
    }

    @action.bound
    showUserAgreement() {
        this.isUserAgreementVisible = true;
    }

    @action.bound
    hideUserAgreement() {
        this.isUserAgreementVisible = false;
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

    @action.bound
    toggleTheme(){
      this.darkTheme = !this.darkTheme;
      if (this.darkTheme ===true){
         this.darkClass='bp3-dark';
       }else{
         this.darkClass="";
       }
    }

}
