import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useBehavior, useStateAsyncInit } from "../../hooks";

import { values } from "lodash";

import { Button, Classes, Dialog, InputGroup, Intent, Spinner, Tab, Tabs } from "@blueprintjs/core";

import { UserWidget } from "../../models/UserWidget";
import { Widget } from "../../models/Widget";

import { storeMetaAPI } from "../../api/clients/StoreMetaAPI";
import { mainStore } from "../../stores/MainStore";

import { classNames, some } from "../../utility";

import styles from "./StoreComponent.scss";

interface StoreSelectionComponentProps {
    stores: Widget[];
    onSelect: (store: Widget) => void;
}

export const StoreSelectionComponent: React.FC<StoreSelectionComponentProps> = (
    props: StoreSelectionComponentProps
) => {
    const themeClass = useBehavior(mainStore.themeClass);

    if (!props.stores || props.stores.length === 0) {
        return <div>No Stores have been made available to you.</div>;
    }
    return (
        <div className={classNames(themeClass, styles.fullCenteredThinAutoHeight)}>
            {props.stores.map((store, index) => (
                <span key={store.id}>
                    <Button
                        onClick={() => {
                            props.onSelect(store);
                        }}
                        className={themeClass}
                        data-element-id="select-store-button"
                        intent={Intent.NONE}
                        style={{ margin: "10px", backgroundColor: "#989898" }}
                    >
                        {store.title}
                        <div style={{ marginTop: "10px" }}>
                            <img src={store.images.smallUrl} alt="Store Icon" width={100} height={100} />
                        </div>
                    </Button>
                </span>
            ))}
        </div>
    );
};
