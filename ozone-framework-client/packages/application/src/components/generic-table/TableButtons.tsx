import * as React from "react";
import { AnchorButton, Button, Intent } from "@blueprintjs/core";

interface TableButtonProps {
    onClick: () => void;
    disabled?: boolean;
    itemName?: string;
}

export const EditButton: React.FC<TableButtonProps> = (props) => {
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
            key={props.itemName ? props.itemName : undefined}
        />
    );
};

export const DeleteButton: React.FC<TableButtonProps> = (props) => {
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
            key={props.itemName ? props.itemName : undefined}
        />
    );
};

export const ShareButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton
            data-element-id={"share-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            icon="share"
            text="Share"
            intent={Intent.SUCCESS}
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
            key={props.itemName ? props.itemName : undefined}
        />
    );
};
