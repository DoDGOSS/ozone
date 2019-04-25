import * as React from "react";
import { Button, Intent } from "@blueprintjs/core";

export const EditButton: React.FC<{ onClick: () => void }> = (props) => {
    return (
        <Button
            text="Edit"
            intent={Intent.PRIMARY}
            icon="edit"
            small={true}
            onClick={props.onClick}
            data-element-id={"user-admin-widget-edit-button"}
        />
    );
};

export const DeleteButton: React.FC<{ onClick: () => void }> = (props) => {
    return (
        <Button
            data-element-id={"user-admin-widget-delete-button"}
            text="Delete"
            intent={Intent.DANGER}
            icon="trash"
            small={true}
            onClick={props.onClick}
        />
    );
};
