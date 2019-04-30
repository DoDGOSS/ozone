import * as React from "react";
import { Button, Classes, Dialog } from "@blueprintjs/core";

import { classNames } from "../../../../../utility";

import { User } from "../../../../../models/User";
import { mainStore } from "../../../../../stores/MainStore";
import { GenericTable } from "../../../../generic-table/GenericTable";
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
    allUsers: User[];
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
            <Dialog
                title={"Add User"}
                className={classNames(styles.dialog, mainStore.getTheme())}
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
            >
                <div className={classNames(Classes.DIALOG_BODY, styles.dialogBody)}>
                    <div style={{ flex: 1, flexDirection: "column" }}>
                        <GenericTable
                            title="Users"
                            items={this.props.allUsers}
                            getColumns={() => [
                                {
                                    Header: "Full Name",
                                    id: "displayName",
                                    accessor: (user: User) => user.displayName
                                },
                                { Header: "Last Sign In", id: "lastLogin", accessor: (user: User) => user.lastLogin }
                            ]}
                            multiSelection={true}
                            onSelectionChange={(selections: User[]) => {
                                this.setState({
                                    selectedUsers: selections
                                });
                            }}
                            {...this.props}
                        />
                        <br />
                        <div>
                            <Button text="Add" disabled={this.state.selectedUsers.length === 0} onClick={this.submit} />
                            <Button text="Cancel" onClick={this.props.onClose} />
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    submit = () => {
        this.props.onSubmit(this.state.selectedUsers);
        this.props.onClose();
    };
}
