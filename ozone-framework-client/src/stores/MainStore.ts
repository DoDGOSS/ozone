import { action, observable, runInAction } from "mobx";
import { injectable } from "../inject";


@injectable()
export class MainStore {

    @observable
    isWarningDialogVisible: boolean;

    @observable
    isHelpDialogVisible: boolean;

    @observable
    isDashboardDialogVisible: boolean;

    @observable
    isWidgetToolbarOpen: boolean;

    @observable
    widgetFilter: string | undefined;

    constructor() {
        runInAction("initialize", () => {
            this.isWarningDialogVisible = false;
            this.isHelpDialogVisible = false;
            this.isDashboardDialogVisible = false;
            this.isWidgetToolbarOpen = false;
        })
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
    hideHelpDialog() {
        this.isHelpDialogVisible = false;
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