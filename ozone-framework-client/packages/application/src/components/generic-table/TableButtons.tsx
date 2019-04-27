import * as React from "react";
import { AnchorButton, Button, Intent } from "@blueprintjs/core";

export const EditButton: React.FC<{ onClick: () => void; disabled?: boolean; itemName?: string }> = (props) => {
    return (
        <AnchorButton // regular buttons don't play well with tooltips on chrome. But the html for these is an <a></a>, not a <button>.
            data-element-id={"edit-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            text="Edit"
            intent={Intent.PRIMARY}
            icon="edit"
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
        />
    );
};

export const DeleteButton: React.FC<{ onClick: () => void; disabled?: boolean; itemName?: string }> = (props) => {
    return (
        <AnchorButton
            data-element-id={"delete-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            text="Delete"
            intent={Intent.DANGER}
            icon="trash"
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
        />
    );
};
