import React, { memo, useEffect, useMemo, useState } from "react";

import { values } from "lodash";
import { Button, Classes, Dialog, InputGroup, Intent, Spinner, Tab, Tabs, Toaster } from "@blueprintjs/core";

import { classNames, some, uuid } from "../../utility";

import { Widget } from "../../models/Widget";
import { WidgetTypeDTO } from "../../api/models/WidgetTypeDTO";

import { storeMetaService } from "../../services/StoreMetaService";
import { widgetTypeApi } from "../../api/clients/WidgetTypeAPI";

import { showConfirmationDialog } from "../confirmation-dialog/showConfirmationDialog";
import { showToast } from "../toaster/Toaster";

import styles from "./index.scss";
import { ListOf, Response } from "../../api/interfaces";

export interface SaveStorePanelProps {
    storeWidget: Widget | undefined;
    closeDialogAndUpdate: () => void;
}

export const SaveStorePanel: React.FC<SaveStorePanelProps> = (props: SaveStorePanelProps) => {
    const store = props.storeWidget;
    if (!store) {
        return <Spinner />;
    }
    const [updateKey, setUpdateKey] = useState(Date.now());

    const [title, setTitle] = useState(store.title);
    const [iconUrl, setIconUrl] = useState(store.images.smallUrl);
    const [loading, setLoading] = useState(false);
    const [subscriptionsShouldCancel, setSubscriptionsShouldCancel] = useState(false);
    const [description, setDescription] = useState(store.description);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        cleanDefaultIconUrl(store.images.smallUrl).then((cleanedUrl: string) => {
            if (!subscriptionsShouldCancel) {
                setIconUrl(cleanedUrl);
                setLoading(false);
            }
        });
    }, [store, store.images.smallUrl]);

    useEffect(() => {
        setTitle(store.title);
        setDescription(store.description);
    }, [store, store.title, store.description]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            *Title:
            <InputGroup
                placeholder="The store's title"
                defaultValue={title}
                onChange={(event: any) => {
                    setTitle(event.target.value);
                }}
            />
            <br />
            <StoreIcon url={iconUrl} />
            Icon URL
            <InputGroup
                placeholder="set new icon url"
                value={iconUrl}
                onChange={(event: any) => {
                    setIconUrl(event.target.value);
                }}
            />
            <br />
            Description:
            <InputGroup
                placeholder="Description of the store"
                defaultValue={description}
                onChange={(event: any) => {
                    setDescription(event.target.value);
                }}
            />
            {errorMessage !== "" ? (
                <div />
            ) : (
                <div>
                    <br />
                    {errorMessage}
                </div>
            )}
            <br />
            <div>* = required</div>
            <br />
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        disabled={title === ""}
                        onClick={() => {
                            store.title = title;
                            let icon = iconUrl;
                            if (icon === "") {
                                icon = "images/store-cart.png";
                            }
                            store.images.smallUrl = icon;
                            store.images.largeUrl = icon;
                            store.description = description;
                            storeMetaService.saveOrUpdateStore(store).then((response: any) => {
                                if (response.status >= 200 && response.status < 400) {
                                    showToast({
                                        message: "Store successfully saved",
                                        intent: Intent.SUCCESS
                                    });
                                    setSubscriptionsShouldCancel(true);
                                    props.closeDialogAndUpdate();
                                    return;
                                }
                                setErrorMessage("Error: could not save store.");
                                showToast({
                                    message: "Error in saving the store.",
                                    intent: Intent.DANGER
                                });
                            });
                        }}
                        icon="add"
                        data-element-id="add-store-button"
                        intent={Intent.NONE}
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={() => {
                            setSubscriptionsShouldCancel(true);
                            props.closeDialogAndUpdate();
                        }}
                        // icon="add"
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

const StoreIcon: React.FC<{ url: string }> = memo(({ url }) => {
    return (
        <div>
            <img src={url} alt="Store Icon" width={100} height={100} />
        </div>
    );
});

async function cleanDefaultIconUrl(iconUrl: string): Promise<string> {
    // TODO: Find and make use of AML's default icon if such a thing exists.
    // old marketplace seemed to always return something like `STORE_URL/public//static/images/...`
    // when the image exists at `STORE_URL/static/images/...`
    // If and only if that is the case, change it automatically.
    const imEx = await imageExists(iconUrl);
    if (!imEx) {
        const iconUrlPieces = iconUrl.split("/public/");
        if (iconUrlPieces.length > 1) {
            const newIconUrl = iconUrlPieces[0] + iconUrlPieces[1];
            const imEx2 = await imageExists(newIconUrl);
            if (imEx2) {
                return newIconUrl;
            }
        }
    }
    return iconUrl;
}

// from https://stackoverflow.com/questions/18837735/
// Need to check for redirects though, since those come back with a 200 for a different page.
// Doesn't appear to work all the time though. Occasionally empty for no reason I understand.
async function imageExists(image_url: string): Promise<boolean> {
    const timeout = 2000;

    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.open("HEAD", image_url);
        http.timeout = timeout;
        try {
            http.send();
            http.onload = () => {
                resolve(
                    http.status === 200 &&
                        (http.responseURL === undefined || http.responseURL === "" || http.responseURL === image_url)
                );
            };
            http.onabort = () => {
                console.log("Aborted");
                resolve(false);
            };
            http.ontimeout = () => {
                console.log("timed out");
                resolve(false);
            };
            http.onerror = () => {
                console.log("error");
                resolve(false);
            };

            // just to make sure
            setTimeout(() => {
                http.abort();
            }, timeout);
        } catch (e) {
            resolve(false);
        }
    });
}

async function getWidgetTypes(): Promise<WidgetTypeDTO[]> {
    const response: Response<ListOf<WidgetTypeDTO[]>> = await widgetTypeApi.getWidgetTypes();

    // TODO: Handle failed request
    if (!(response.status >= 200 && response.status < 400)) return [];

    return response.data.data;
}
