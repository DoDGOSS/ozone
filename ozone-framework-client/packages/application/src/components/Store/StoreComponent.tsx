import React from "react";
import { AnchorButton, ButtonGroup, Divider, Intent, Spinner } from "@blueprintjs/core";

import { storeMetaAPI } from "../../api/clients/StoreMetaAPI";
import { storeMetaService } from "../../services/StoreMetaService";
import { storeImportService } from "../../services/StoreImportService";
import { mainStore } from "../../stores/MainStore";
import { Widget } from "../../models/Widget";

import { StoreSelectionDialog } from "./StoreSelectionDialog";
import { StoreSelectionComponent } from "./StoreSelectionComponent";

import { classNames } from "../../utility";
import * as styles from "./StoreComponent.scss";

interface StoreProps {
    storeShouldRefresh: boolean;
}

interface StoreState {
    loading: boolean;
    storeSelected: boolean;
    currentStore: Widget | undefined;
    storeUrl: string;
    showSelectStoreDialog: boolean;
    stores: Widget[];
}

export class StoreComponent extends React.Component<StoreProps, StoreState> {
    constructor(props: StoreProps) {
        super(props);
        this.state = {
            loading: false,
            storeSelected: false,
            currentStore: undefined,
            storeUrl: "",
            showSelectStoreDialog: false,
            stores: []
        };
    }

    componentDidMount() {
        window.addEventListener("message", this.receiveListingOpenedInStore, false);
        storeMetaAPI.getStores().then((stores) => {
            if (stores.length === 1) {
                this.useStore(stores[0]);
            }
            this.setState({ stores });
        });
    }

    componentDidUpdate() {
        if (this.props.storeShouldRefresh) {
            this.refreshStore();
            mainStore.storeHasRefreshed();
        }
        storeMetaAPI.getStores().then((storeWidgets) => {
            if (!this.state.stores || storeWidgets.length !== this.state.stores.length) {
                this.setState({ stores: storeWidgets });
            } else {
                for (const knownStore of this.state.stores) {
                    if (
                        !storeWidgets.find(
                            (updatedStore) => knownStore.id === updatedStore.id && knownStore.url === updatedStore.url
                        )
                    ) {
                        this.setState({ stores: storeWidgets });
                        break;
                    }
                }
            }
            // typescript has a fit if the currentStore check is outside this loop, I guess because stated could get
            // updated while the loop is happening
            if (
                this.state.currentStore !== undefined &&
                !storeWidgets.find(
                    (store) => this.state.currentStore !== undefined && this.state.currentStore.id === store.id
                )
            ) {
                this.setState({
                    currentStore: undefined,
                    storeSelected: false
                });
            }
        });
    }

    refreshStore(hard?: boolean) {
        if (hard === true) {
            this.setState({
                storeSelected: false
            });
            return;
        } else if (this.state.currentStore !== undefined) {
            this.setState(
                {
                    storeSelected: false
                },
                () => {
                    // may need a timeout
                    this.setState({
                        storeSelected: true
                    });
                }
            );
        }
    }

    useStore(newStore: Widget): void {
        this.setState({
            currentStore: newStore,
            storeUrl: newStore.url,
            storeSelected: true,
            loading: false
        });
    }

    receiveListingOpenedInStore = (messageEvent: { origin: string; data: any }) => {
        if (!this.state.currentStore || !this.messageIsFromStore(messageEvent)) {
            return;
        }

        const listing = messageEvent.data;
        storeImportService.importListing(this.state.currentStore, listing);

        mainStore.hideStore();
    };

    messageIsFromStore(messageEvent: any) {
        // should we check source too?  //  message.source.origin === this.state.storeUrl
        const cleanedOrigin = storeMetaService.cleanStoreUrl(messageEvent.origin);
        const cleanedStoreUrl = storeMetaService.cleanStoreUrl(this.state.storeUrl);

        if (cleanedOrigin === cleanedStoreUrl || cleanedStoreUrl.startsWith(cleanedOrigin)) {
            messageEvent.preventDefault();
            messageEvent.stopPropagation();
            return true;
        }
        return false;
    }

    render() {
        if (this.state.loading) {
            return (
                <div className={classNames(styles.fullCentered)}>
                    <Spinner />
                </div>
            );
        }
        if (!this.state.storeSelected || !this.state.currentStore) {
            return (
                <div className={classNames(mainStore.themeClass().value, styles.fullCenteredThin)}>
                    <h2>Select a store to open.</h2>
                    <StoreSelectionComponent
                        stores={this.state.stores}
                        onSelect={(store: Widget) => {
                            this.useStore(store);
                        }}
                    />
                </div>
            );
        } else if (this.state.stores.length === 0) {
            return (
                <div className={classNames(mainStore.themeClass().value, styles.fullCentered)}>
                    No stores have been added. Add a store through the "System Configuration" administrator widget.
                </div>
            );
        }
        return (
            <div className={classNames(mainStore.themeClass().value, styles.fullCenteredThin)}>
                <div className={classNames(mainStore.themeClass().value, styles.storeBanner)}>
                    <span className={"storeTitle"}>{this.state.currentStore.title}</span>
                    <span>
                        <ButtonGroup
                            data-element-id={"store-actions"}
                            data-role={"store-actions"}
                            data-name={this.state.currentStore.title}
                        >
                            <AnchorButton
                                onClick={() => {
                                    this.openStoreSelectionDialog();
                                }}
                                disabled={this.state.stores.length === 0}
                                data-element-id="select-store-button"
                                intent={Intent.SUCCESS}
                            >
                                Switch store
                            </AnchorButton>
                            <Divider />
                            <AnchorButton
                                title={"Reload store page"}
                                onClick={() => {
                                    this.refreshStore();
                                }}
                                disabled={this.state.stores.length === 0}
                                data-element-id="soft-refresh-store-button"
                            >
                                Refresh store
                            </AnchorButton>
                            <Divider />
                            <AnchorButton
                                title={"Use if store is making the app sluggish"}
                                onClick={() => {
                                    this.refreshStore(true);
                                }}
                                data-element-id="hard-refresh-store-button"
                            >
                                Close store
                            </AnchorButton>
                        </ButtonGroup>
                    </span>
                </div>
                <div style={{ height: "94%", width: "100%" }}>
                    <iframe id={"iframe"} src={this.state.storeUrl} height={"100%"} width={"100%"} />
                </div>
                <StoreSelectionDialog
                    isOpen={this.state.showSelectStoreDialog}
                    onSelect={(selectedStore: Widget) => this.useStore(selectedStore)}
                    onClose={() => this.closeStoreSelectionDialog()}
                />
            </div>
        );
    }

    openStoreSelectionDialog() {
        this.setState({
            showSelectStoreDialog: true
        });
    }
    closeStoreSelectionDialog() {
        this.setState({
            showSelectStoreDialog: false
        });
    }
}
