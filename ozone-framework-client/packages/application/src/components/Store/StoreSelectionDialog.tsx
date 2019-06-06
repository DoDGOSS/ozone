import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useBehavior, useStateAsyncInit } from "../../hooks";

import { values } from "lodash";

import { Button, Classes, Dialog, InputGroup, Intent, Spinner, Tab, Tabs } from "@blueprintjs/core";

import { UserWidget } from "../../models/UserWidget";
import { Widget } from "../../models/Widget";

import { storeMetaAPI } from "../../api/clients/StoreMetaAPI";
import { mainStore } from "../../stores/MainStore";

import { StoreSelectionComponent } from "./StoreSelectionComponent";

import { classNames, some } from "../../utility";

import styles from "./StoreComponent.scss";

interface StoreDialogProps {
    isOpen: boolean;
    onSelect: (store: Widget) => void;
    onClose: () => void;
}

export const StoreSelectionDialog: React.FC<StoreDialogProps> = (props: StoreDialogProps) => {
    const themeClass = useBehavior(mainStore.themeClass);
    const [selectedStore, setSelectedStore] = useState(undefined);

    const [stores, setStores] = useState<Widget[]>([]);
    useEffect(() => {
        storeMetaAPI.getStores().then((storeWidgets: Widget[]) => setStores(storeWidgets));
    }, [props.isOpen]);
    return (
        <div>
            <Dialog
                className={classNames(styles.dialog, themeClass)}
                isOpen={props.isOpen}
                onClose={props.onClose}
                title="Select Store"
                icon="shopping-cart"
            >
                <div className={Classes.DIALOG_BODY} data-element-id={"store-selection-dialog"}>
                    <h2>Select a store to open.</h2>
                    <StoreSelectionComponent
                        stores={stores}
                        onSelect={(store: Widget) => {
                            props.onSelect(store);
                            props.onClose();
                        }}
                    />
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            onClick={() => props.onClose()}
                            // icon="add"
                            data-element-id="close-store-button"
                            intent={Intent.NONE}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
