import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog } from "@blueprintjs/core";

import { Inject, MainStore } from "../../stores";


export type DashboardDialogProps = {
    store?: MainStore
}

@Inject(({ mainStore }) => ({ store: mainStore }))
@observer
export class DashboardDialog extends React.Component<DashboardDialogProps> {

    public render() {
        const { store } = this.props;

        if (!store) return null;

        return (
            <div>
                <Dialog isOpen={store.isDashboardDialogVisible}
                        onClose={store.hideDashboardDialog}
                        title="Dashboards">

                    <div className={Classes.DIALOG_BODY}/>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={store.hideDashboardDialog}
                                    icon="insert">
                                Create New
                            </Button>
                        </div>
                    </div>

                </Dialog>
            </div>
        )
    }

}
