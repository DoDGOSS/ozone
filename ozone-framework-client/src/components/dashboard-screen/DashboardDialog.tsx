import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";


@observer
export class DashboardDialog extends React.Component {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    render() {
        return (
            <div>
                <Dialog className={this.mainStore.darkClass}
                        isOpen={this.mainStore.isDashboardDialogVisible}
                        onClose={this.mainStore.hideDashboardDialog}
                        title="Dashboards">

                    <div className={Classes.DIALOG_BODY}/>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.mainStore.hideDashboardDialog}
                                    icon="insert">
                                Create New
                            </Button>
                        </div>
                    </div>

                </Dialog>
            </div>
        );
    }

}
