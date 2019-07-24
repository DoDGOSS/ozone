import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useBehavior } from "../../hooks";

import { values } from "lodash";

import { Button, Classes, Dialog, InputGroup, Intent, Spinner, Tab, Tabs } from "@blueprintjs/core";

import { UserWidget } from "../../models/UserWidget";
import { Widget } from "../../models/Widget";

import { mainStore } from "../../stores/MainStore";

import { GetStorePanel } from "./GetStorePanel";
import { SaveStorePanel } from "./SaveStorePanel";

import { classNames, some, uuid } from "../../utility";

import styles from "./index.scss";

interface StoreDialogProps {
    dialogOpen: boolean;
    storeToEdit: Widget | undefined;
    closeDialogAndUpdate: () => void;
}

export const AddStoreDialog: React.FC<StoreDialogProps> = (props: StoreDialogProps) => {
    const themeClass = useBehavior(mainStore.themeClass);
    const [store, setStore] = useState(props.storeToEdit);
    const [selectedTabID, setSelectedTabID] = useState("storeUrl");
    const [dialogKey, setDialogKey] = useState(uuid());

    useEffect(() => {
        setStore(props.storeToEdit);
        setSelectedTabID(props.storeToEdit ? "storeDefinition" : "storeUrl");
    }, [props.storeToEdit]);

    useEffect(() => {
        setDialogKey(uuid());
    }, [props.dialogOpen]);

    const closeDialog = () => {
        setStore(undefined);
        props.closeDialogAndUpdate();
    };

    return (
        <div>
            <Dialog
                key={dialogKey}
                className={classNames(styles.dialog, themeClass)}
                isOpen={props.dialogOpen}
                onClose={props.closeDialogAndUpdate}
                title="Add Store"
                icon="shopping-cart" // maybe just remove this
            >
                <div className={Classes.DIALOG_BODY} data-element-id={"stack-dialog"}>
                    <Tabs
                        id="Tabs"
                        selectedTabId={selectedTabID}
                        onChange={(clickedTabId: string) => setSelectedTabID(clickedTabId)}
                    >
                        <Tab
                            id="storeUrl"
                            title="Import Store"
                            panel={
                                <GetStorePanel
                                    setStore={(storeWidget: Widget) => {
                                        setStore(storeWidget);
                                        setSelectedTabID("storeDefinition");
                                    }}
                                    closeDialogAndUpdate={closeDialog}
                                    initialStoreFrontUrl={store ? store.url : ""}
                                    initialStoreBackUrl={store && store.descriptorUrl ? store.descriptorUrl : ""}
                                />
                            }
                        />
                        <Tab
                            id="storeDefinition"
                            disabled={store === undefined}
                            title="Add Store"
                            panel={<SaveStorePanel storeWidget={store} closeDialogAndUpdate={closeDialog} />}
                        />
                        <Tabs.Expander />
                    </Tabs>
                </div>
            </Dialog>
        </div>
    );
};
