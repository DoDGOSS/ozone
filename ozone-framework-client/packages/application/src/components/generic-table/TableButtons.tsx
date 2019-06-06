import * as React from "react";
import { AnchorButton, Intent } from "@blueprintjs/core";

interface TableButtonProps {
    onClick: (event?: any) => void;
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

export const CompactEditButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton // regular buttons don't play well with tooltips on chrome. But the html for these is an <a></a>, not a <button>.
            data-element-id={"edit-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            title={props.itemName ? props.itemName : ""}
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

export const CompactDeleteButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton
            data-element-id={"delete-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            title={props.itemName ? props.itemName : ""}
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

export const CompactShareButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton
            data-element-id={"share-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            icon="share"
            title={props.itemName ? props.itemName : ""}
            intent={Intent.SUCCESS}
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
            key={props.itemName ? props.itemName : undefined}
        />
    );
};

export const AddButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton
            data-element-id={"add-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            icon="add"
            text="Add"
            intent={Intent.NONE}
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
            key={props.itemName ? props.itemName : undefined}
        />
    );
};

export const CompactAddButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton
            data-element-id={"add-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            icon="add"
            title={props.itemName ? props.itemName : ""}
            intent={Intent.NONE}
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
            key={props.itemName ? props.itemName : undefined}
        />
    );
};

export const RestoreButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton
            data-element-id={"restore-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            icon="history"
            text="Restore"
            intent={Intent.WARNING}
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
            key={props.itemName ? props.itemName : undefined}
        />
    );
};

export const CompactRestoreButton: React.FC<TableButtonProps> = (props) => {
    return (
        <AnchorButton
            data-element-id={"restore-button"}
            data-widget-title={props.itemName ? props.itemName : ""}
            icon="history"
            title={props.itemName ? props.itemName : ""}
            intent={Intent.WARNING}
            small={true}
            onClick={props.onClick}
            disabled={props.disabled ? props.disabled : false}
            key={props.itemName ? props.itemName : undefined}
        />
    );
};
