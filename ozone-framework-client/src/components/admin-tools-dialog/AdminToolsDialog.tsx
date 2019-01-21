import * as styles from "./WidgetTile.scss";

import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore, WidgetStore } from "../../stores";


@observer
export class AdminToolsDialog extends React.Component {

    @lazyInject(MainStore)
    private mainStore: MainStore;

    @lazyInject(WidgetStore)
    private widgetStore: WidgetStore;

    render() {
        const adminWidgets = this.widgetStore.adminWidgets;

        return (
            <div>
                <Dialog className={[this.mainStore.darkClass, styles.adminToolsDialog].join(' ')}
                        isOpen={this.mainStore.isAdminToolsDialogOpen}
                        onClose={this.mainStore.hideAdminToolsDialog}
                        title="Administration"
                        icon="wrench">

                    <div className={Classes.DIALOG_BODY}>
                        <div className={styles.tileContainer}>
                            {adminWidgets.map(widget =>
                                <WidgetTile key={widget.id}
                                            title={widget.title}
                                            iconUrl={widget.iconUrl}/>
                            )}
                        </div>
                    </div>

                </Dialog>
            </div>
        );
    }

}


export type WidgetTileProps = {
    title: string;
    iconUrl: string;
};

export class WidgetTile extends React.PureComponent<WidgetTileProps> {


    render() {
        const { title, iconUrl } = this.props;

        return (
            <div className={styles.widgetTile}>
                <img className={styles.tileIcon} src={iconUrl}/>
                <span className={styles.tileTitle}>{title}</span>
            </div>
        );
    }

}
