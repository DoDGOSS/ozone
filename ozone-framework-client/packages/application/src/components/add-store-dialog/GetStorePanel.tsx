import React, { useEffect, useMemo, useState } from "react";
import { useBehavior } from "../../hooks";

import { values } from "lodash";

import { Button, Classes, Dialog, InputGroup, Intent, Radio, RadioGroup, Spinner, Tab, Tabs } from "@blueprintjs/core";

import { Widget } from "../../models/Widget";

import { storeMetaAPI } from "../../api/clients/StoreMetaAPI";
import { storeMetaService } from "../../services/StoreMetaService";

import { mainStore } from "../../stores/MainStore";

import { classNames, handleStringChange, some } from "../../utility";

import styles from "./index.scss";

export interface GetStorePanelProps {
    setStore: (newStore: Widget) => void;
    closeDialogAndUpdate: () => void;
    initialStoreFrontUrl: string;
    initialStoreBackUrl: string;
}

const StoreType = {
    OMP: "omp",
    AML: "aml"
};

export const GetStorePanel: React.FC<GetStorePanelProps> = (props: GetStorePanelProps) => {
    const [storeFrontUrl, setStoreFrontUrl] = useState("");
    const [storeBackUrl, setStoreBackUrl] = useState("");
    const [storeMessage, setStoreMessage] = useState("");
    const [storeType, setStoreType] = useState(StoreType.OMP);

    useEffect(() => {
        setStoreFrontUrl(getInitialUrl(props.initialStoreFrontUrl));
        setStoreBackUrl(getInitialUrl(props.initialStoreBackUrl));
    }, [props.initialStoreFrontUrl, props.initialStoreBackUrl]);
    return (
        <div>
            <div>
                <div style={{ width: "100%" }}>
                    <RadioGroup
                        label="Type of store."
                        selectedValue={storeType}
                        onChange={handleStringChange(setStoreType)}
                    >
                        <Radio label="OMP Marketplace" value={StoreType.OMP} />
                        <Radio label="AML AppsMall" value={StoreType.AML} />
                    </RadioGroup>

                    <div className="growing-left">
                        {storeType === StoreType.OMP && (
                            <InputGroup
                                value={storeFrontUrl}
                                placeholder="The URL of the store"
                                onChange={(event: any) => {
                                    setStoreFrontUrl(event.target.value);
                                    setStoreBackUrl("");
                                }}
                            />
                        )}
                        {storeType === StoreType.AML && (
                            <div>
                                <InputGroup
                                    value={storeFrontUrl}
                                    placeholder="The URL for the store's frontend"
                                    onChange={(event: any) => {
                                        setStoreFrontUrl(event.target.value);
                                    }}
                                />
                                <InputGroup
                                    value={storeBackUrl}
                                    placeholder="The URL for the store's backend"
                                    onChange={(event: any) => {
                                        setStoreBackUrl(event.target.value);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <br />
            {storeMessage !== "" && <div>{storeMessage}</div>}

            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {/* <div className="button-fixed-right"> */}
                    <Button
                        disabled={storeFrontUrl === "" || (storeType === StoreType.AML && storeBackUrl === "")}
                        onClick={() => {
                            storeMetaAPI.importStore(
                                storeFrontUrl + "_~_" + storeBackUrl,
                                (storeWidget: Widget | undefined) => {
                                    if (storeWidget) {
                                        props.setStore(storeWidget);
                                    } else {
                                        setStoreMessage("No store found at given URL.");
                                    }
                                }
                            );
                        }}
                        icon="arrow-right"
                        data-element-id="add-store-button"
                        intent={Intent.NONE}
                    />
                    {/* </div> */}
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
