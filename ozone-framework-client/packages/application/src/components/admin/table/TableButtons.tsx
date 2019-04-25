import * as React from "react";
import { Button, Intent } from "@blueprintjs/core";

export const EditButton: React.FC<{ onClick: () => void; disabled?: boolean; correspondingItemName?: string }> = (
    props
) => {
    return (
        <Button
            data-element-id={"edit-button"}
            data-widget-title={props.correspondingItemName ? props.correspondingItemName : ""}
            text="Edit"
            intent={Intent.PRIMARY}
            icon="edit"
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
        />
    );
};

export const DeleteButton: React.FC<{ onClick: () => void; disabled?: boolean; correspondingItemName?: string }> = (
    props
) => {
    return (
        <Button
            data-element-id={"delete-button"}
            data-widget-title={props.correspondingItemName ? props.correspondingItemName : ""}
            text="Delete"
            intent={Intent.DANGER}
            icon="trash"
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
        />
    );
};
