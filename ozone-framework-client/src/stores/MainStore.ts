import { observable } from "mobx";
import { injectable } from "../inject";


@injectable()
export class MainStore {

    @observable
    public isWarningDialogVisible = false;

    @observable
    public isHelpDialogVisible = false;

    @observable
    public isDashboardDialogVisible = false;

    @observable
    public isWidgetToolbarOpen = false;

    @observable
    public widgetFilter: string | undefined;

    public showWarningDialog = () => this.isWarningDialogVisible = true;
    public hideWarningDialog = () => this.isWarningDialogVisible = false;

    public showHelpDialog = () => this.isHelpDialogVisible = true;
    public hideHelpDialog = () => this.isHelpDialogVisible = false;

    public showDashboardDialog = () => this.isDashboardDialogVisible = true;
    public hideDashboardDialog = () => this.isDashboardDialogVisible = false;

    public closeWidgetToolbar = () => this.isWidgetToolbarOpen = false;
    public toggleWidgetToolbar = () => this.isWidgetToolbarOpen = !this.isWidgetToolbarOpen;

    public setWidgetFilter = (value: string) => this.widgetFilter = value;

}
