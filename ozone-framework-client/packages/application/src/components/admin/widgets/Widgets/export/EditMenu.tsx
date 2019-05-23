import { Menu, MenuItem } from "@blueprintjs/core";
import * as React from "react";

export interface EditMenuProps {
  openExportDialog: () => void;
}

export const EditMenu: React.FC<EditMenuProps> = (props) => {
  return (
    <Menu>
      <MenuItem text="Export" onClick={props.openExportDialog} />
    </Menu>
  );
};
