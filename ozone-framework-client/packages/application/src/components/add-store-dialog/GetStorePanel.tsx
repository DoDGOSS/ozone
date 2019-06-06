import React, { useEffect, useMemo, useState } from "react";
import { useBehavior } from "../../hooks";

import { values } from "lodash";

import { Button, Classes, Dialog, InputGroup, Intent, Spinner, Tab, Tabs } from "@blueprintjs/core";

import { Widget } from "../../models/Widget";

import { storeMetaAPI } from "../../api/clients/StoreMetaAPI";
import { storeMetaService } from "../../services/StoreMetaService";

import { mainStore } from "../../stores/MainStore";

import { classNames, some } from "../../utility";

import styles from "./index.scss";

export interface GetStorePanelProps {
    setStore: (newStore: Widget) => void;
    closeDialogAndUpdate: () => void;
    initialStoreUrl: string;
}

export const GetStorePanel: React.FC<GetStorePanelProps> = (props: GetStorePanelProps) => {
    const [storeUrl, setStoreUrl] = useState("");
    const [storeMessage, setStoreMessage] = useState("");
    useEffect(() => {
        setStoreUrl(getInitialUrl(props.initialStoreUrl));
    }, [props.initialStoreUrl]);
    return (
        <div>
            <div>
                <div style={{ width: "100%" }}>
                    <div className="button-fixed-right">
                        <Button
                            disabled={storeUrl === ""}
                            onClick={() => {
                                storeMetaAPI.importStore(storeUrl, (storeWidget: Widget | undefined) => {
                                    if (storeWidget) {
                                        props.setStore(storeWidget);
                                    } else {
                                        setStoreMessage("No store found at given URL.");
                                    }
                                });
                            }}
                            icon="arrow-right"
                            data-element-id="add-store-button"
                            intent={Intent.NONE}
                        />
                    </div>
                    <div className="growing-left">
                        <InputGroup
                            value={storeUrl}
                            placeholder="The URL of the store"
                            onChange={(event: any) => {
                                setStoreUrl(event.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>

            <br />
            {storeMessage !== "" && <div>{storeMessage}</div>}

            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        onClick={props.closeDialogAndUpdate}
                        data-element-id="close-store-button"
                        intent={Intent.NONE}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

function getInitialUrl(url: string): string {
    if (!url) {
        return "";
    }
    return storeMetaService.cleanStoreUrl(url);
}
