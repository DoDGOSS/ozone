import * as React from "react";
import { Button, Classes, Dialog } from "@blueprintjs/core";

import { classNames } from "../../../../../utility";

import { Group } from "../../../../../models/Group";
import { mainStore } from "../../../../../stores/MainStore";
import { ColumnTabulator } from "../../../../generic-table/GenericTable";
import { TableSelectionDialog } from "../../../../table-selection-dialog/TableSelectionDialog";

import * as styles from "./GroupsDialog.scss";

interface State {
    loading: boolean;
    selectedGroups: Group[];
    dialogOpen: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newGroups: Group[]) => void;
    getAllGroups: () => Promise<Group[]>;
}

export class GroupsDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            selectedGroups: [],
            dialogOpen: false
        };
    }

    render() {
        return (
            <TableSelectionDialog
                title="Grant Group(s) permissions to access Widget"
                show={this.props.isOpen}
                getItems={this.props.getAllGroups}
                columns={
                    [
                        { title: "Name", field: "name" },
                        { title: "Description", field: "description" }
                    ] as ColumnTabulator[]
                }
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
            />
        );
    }
}
