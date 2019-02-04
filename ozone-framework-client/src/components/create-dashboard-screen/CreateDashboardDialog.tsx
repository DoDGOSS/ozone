import * as React from "react";
import { observer } from "mobx-react";
import { action } from "mobx";

import { Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";
import { CreateDashboardForm } from "./CreateDashboardForm";

const CreateDashboardStyles={
    minWidth:"600px",
  };

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
                <Dialog className={this.mainStore.darkClass}
                        isOpen={this.mainStore.isCreateDashboardDialogVisible}
                        onClose={this.mainStore.hideCreateDashboardDialog}
                        title="Create New Dashboard"
                        style={CreateDashboardStyles}>

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
