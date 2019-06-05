import { Menu, MenuItem } from "@blueprintjs/core";
import * as React from "react";

export interface EditMenuProps {
    openExportDialog: () => void;
}

export const EditMenu: React.FC<EditMenuProps> = (props) => {
    return (
        <Menu data-element-id="edit-menu">
            <MenuItem data-element-id="export-button" text="Export" onClick={props.openExportDialog} />
        </Menu>
    );
};
