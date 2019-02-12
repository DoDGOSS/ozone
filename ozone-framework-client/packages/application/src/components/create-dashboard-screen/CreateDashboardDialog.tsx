import * as React from "react";
import { observer } from "mobx-react";
import { action } from "mobx";

import { Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";
import { CreateDashboardForm } from "./CreateDashboardForm";
import * as styles from "./CreateDashboardStyles.scss";
import { classNames } from "../util";

@observer
export class CreateDashboardDialog extends React.Component {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @action.bound
    submitDashboard(){
      this.mainStore.hideCreateDashboardDialog();
      window.location.reload();
    }

    render() {
        return (
            <div>
                <Dialog className={classNames(this.mainStore.darkClass,styles.CreateDashboardStyles)}
                        isOpen={this.mainStore.isCreateDashboardDialogVisible}
                        onClose={this.mainStore.hideCreateDashboardDialog}
                        title="Create New Dashboard"
                        >

                    <div data-element-id='CreateDashboardDialog' className={Classes.DIALOG_BODY}>
                    <CreateDashboardForm onSubmit={this.submitDashboard} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} />
                    </div>

                </Dialog>
            </div>
        );
    }

}
