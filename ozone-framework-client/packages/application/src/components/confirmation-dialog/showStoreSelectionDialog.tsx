import React from "react";
import { useBehavior } from "../../hooks";
import { Button, Classes, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";
import { confirmDialogWrapper } from "./ConfirmDialogWrapper";

import { Widget } from "../../models/Widget";

import { StoreSelectionComponent } from "../Store/StoreSelectionComponent";

import "./custom-style.scss";

interface ShowStoreSelectionDialogProps {
    stores: Widget[];
    onConfirm: (store: Widget) => void;
    onCancel: () => void;
}

/**
 * Used only in StackDialog, because it doesn't have any frame to render in, so I either need to
 * create this stand-alone dialog, or add yet more things to the mainstore and homescreen.
 *
 */
export const showStoreSelectionDialog = (props: ShowStoreSelectionDialogProps) => {
    confirmDialogWrapper({
        onConfirm: props.onConfirm,
        onCancel: props.onCancel,
        innerUI: (closeDialog, onConfirm, onCancel) => {
            return (
                <div className={classNames(Classes.DIALOG, mainStore.themeClass().value)}>
                    <div className={Classes.DIALOG_HEADER}>Select a Store</div>
                    <div className={Classes.DIALOG_BODY}>
                        <div>Please select which store you would like to push the Stack to:</div>
                        <StoreSelectionComponent
                            stores={props.stores}
                            onSelect={(store: Widget) => {
                                onConfirm(store);
                                closeDialog();
                            }}
                        />
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() => {
                                    onCancel();
                                    closeDialog();
                                }}
                                intent={undefined}
                                rightIcon={"cross"}
                                data-element-id="confirmation-cancel"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    });
    return <div />;
};
