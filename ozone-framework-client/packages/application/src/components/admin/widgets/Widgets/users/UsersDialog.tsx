import * as React from "react";
import { Button, Classes, Dialog } from "@blueprintjs/core";

import { classNames } from "../../../../../utility";

import { User } from "../../../../../models/User";
import { mainStore } from "../../../../../stores/MainStore";
import { ColumnTabulator } from "../../../../generic-table/GenericTable";
import { SelectionDialogProps, TableSelectionDialog } from "../../../../table-selection-dialog/TableSelectionDialog";

import * as styles from "./UsersDialog.scss";

interface State {
    loading: boolean;
    selectedUsers: User[];
    dialogOpen: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userSelections: User[]) => void;
    getAllUsers: () => Promise<User[]>;
}

export class UsersDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            selectedUsers: [],
            dialogOpen: false
        };
    }

    render() {
        return (
            <TableSelectionDialog
                title="Grant User(s) permissions to access Widget"
                show={this.props.isOpen}
                getItems={this.props.getAllUsers}
                columns={
                    [
                        { title: "Full Name", field: "displayName" },
                        { title: "Last Sign In", field: "lastLogin" }
                    ] as ColumnTabulator[]
                }
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }
}
