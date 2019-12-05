import React from "react";
import { Button, Intent } from "@blueprintjs/core";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { storeMetaAPI } from "../../../../api/clients/StoreMetaAPI";

import { Widget } from "../../../../models/Widget";

import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";

import { AddStoreDialog } from "../../../add-store-dialog/AddStoreDialog";

import { classNames, uuid } from "../../../../utility";

import * as sysConfigStyles from "./SystemConfigWidget.scss";

import * as styles from "./StorePanel.scss";

interface StorePanelState {
    stores: Widget[];
    storeToEdit: Widget | undefined;
    storeDialogOpen: boolean;
    addDialogKey: string;
}

export class StorePanel extends React.Component<{}, StorePanelState> {
    _isMounted: boolean = false;
    constructor(props: {}) {
        super(props);
        this.state = {
            stores: [],
            storeToEdit: undefined,
            storeDialogOpen: false,
            addDialogKey: uuid()
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.updateStoreList();
    }

    componentDidUpdate() {
        this.updateStoreList();
    }

    render() {
        return (
            <div style={{ width: "95%" }}>
                <div style={{ width: "100%", height: "7%", margin: "20px" }}>
                    <div className={styles.fixedRightAddStoreButton}>
                        <Button
                            onClick={() => {
                                this.addNewStore();
                            }}
                            icon="add"
                            data-element-id="open-add-store-dialog-button"
                            intent={Intent.NONE}
                        >
                            Add new store
                        </Button>
                    </div>
                    <div className={styles.variableWidthLeft}>
                        <span className={sysConfigStyles.sectionTitle}>Stores</span>
                    </div>
                </div>
                <br />
                <div>{this.state.stores.map((store) => this.getStoreElement(store))}</div>
                <AddStoreDialog
                    key={this.state.addDialogKey}
                    dialogOpen={this.state.storeDialogOpen}
                    storeToEdit={this.state.storeToEdit}
                    closeDialogAndUpdate={() => {
                        this.setState(
                            {
                                storeToEdit: undefined,
                                addDialogKey: uuid()
                            },
                            () => {
                                this.closeStoreDialog();
                                this.updateStoreList();
                            }
                        );
                    }}
                />
            </div>
        );
    }

    getStoreElement(store: Widget) {
        return (
            <div key={store.id} className={classNames(styles.storeItem)}>
                <div className={styles.storeLabel}>
                    <div>{store.title}</div>
                    <div className={styles.storeIcon}>
                        <img src={store.images.smallUrl} alt="Store Icon" width={120} height={120} />
                    </div>
                    <div className={styles.storeButtons}>
                        <div className={""}>
                            <DeleteButton itemName={store.title} onClick={() => this.confirmAndDeleteStore(store)} />
                        </div>
                        <div className={""}>
                            <EditButton
                                itemName={store.title}
                                onClick={() => {
                                    this.editStore(store);
                                }}
                            />
                        </div>
                    </div>
                    <div className={classNames(sysConfigStyles.fieldDescription, styles.storeDescription)}>
                        {store.description}
                    </div>
                </div>
                <br />
            </div>
        );
    }

    addNewStore() {
        this.setState({
            storeDialogOpen: true,
            storeToEdit: undefined
        });
    }

    editStore(store: Widget) {
        this.setState({
            storeToEdit: store,
            storeDialogOpen: true
        });
    }

    closeStoreDialog() {
        this.setState({
            storeDialogOpen: false,
            storeToEdit: undefined
        });
    }

    updateStoreList() {
        storeMetaAPI.getStores().then((storeWidgets) => {
            if (!this._isMounted) {
                return;
            }
            if (this.state.stores && storeWidgets.length === this.state.stores.length) {
                for (const knownStore of this.state.stores) {
                    if (!storeWidgets.find((updatedStore) => knownStore.id === updatedStore.id)) {
                        this.setState({ stores: storeWidgets });
                        return;
                    }
                }
                return;
            }
            this.setState({ stores: storeWidgets });
        });
    }

    confirmAndDeleteStore(storeToRemove: Widget): void {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: storeToRemove.title, style: "bold" }, "."],
            onConfirm: () => this.deleteStore(storeToRemove)
        });
    }

    deleteStore(store: Widget) {
        widgetApi.deleteWidget(store.id!).then((response) => {
            if (response.status >= 200 && response.status < 400) {
                this.updateStoreList();
                return;
            }
            console.log("Error in deleting the store. Check network logs.");
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}
