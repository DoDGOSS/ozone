import "./custom-style.scss";

import React from "react";
import { Button, Classes, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";
import { confirmDialogWrapper } from "./ConfirmDialogWrapper";

import { InvalidUrlList } from "./InvalidUrlList";

interface ShowUrlCheckDialogProps {
    items: { type: "stack" | "dashboard" | "widget"; name: string; url: string }[];
    onConfirm?: () => void;
}

/**
 * See StoreMetaService for use
 */
export const showUrlCheckDialog = (props: ShowUrlCheckDialogProps) => {
    confirmDialogWrapper({
        onConfirm: props.onConfirm,
        innerUI: (closeDialog, onConfirm, onCancel) => {
            return (
                <div className={mainStore.themeClass().value}>
                    <InvalidUrlList
                        items={props.items}
                        closeMe={() => {
                            onConfirm();
                            closeDialog();
                        }}
                    />
                </div>
            );
        }
    });
};
