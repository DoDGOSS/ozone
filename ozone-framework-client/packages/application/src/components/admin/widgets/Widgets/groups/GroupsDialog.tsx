import * as React from "react";
import ReactTable, { Column } from "react-table";
import { Button, Classes, Dialog, MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { CancelButton, CheckBox, FormError, HiddenField, SubmitButton, TextField } from "../../../../form";
import { classNames } from "../../../../../utility";

import { Group } from "../../../../../models/Group";
import { mainStore } from "../../../../../stores/MainStore";
import { GenericTable } from "../../../table/GenericTable";
import * as styles from "./GroupsDialog.scss";

interface State {
    loading: boolean;
    selectedGroup: Group | undefined;
    dialogOpen: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newGroup: Group) => void;
    allGroups: Group[];
}

export class GroupsDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            selectedGroup: undefined,
            dialogOpen: false
        };
    }

    render() {
        return (
            <Dialog
                title={"Add Group"}
                className={classNames(styles.dialog, mainStore.getTheme())}
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
            >
                <div className={classNames(Classes.DIALOG_BODY, styles.dialogBody)}>
                    <div style={{ flex: 1, flexDirection: "column" }}>
                        <GenericTable
                            title="Groups"
                            items={this.props.allGroups}
                            getColumns={() => [
                                {
                                    Header: "Name",
                                    id: "name",
                                    accessor: (group: Group) => group.name
                                },
                                {
                                    Header: "Description",
                                    id: "description",
                                    accessor: (group: Group) => group.description
                                }
                            ]}
                            onSelect={(selected: Group) => {
                                this.setState({
                                    selectedGroup: selected
                                });
                            }}
                            {...this.props}
                        />
                        <br />
                        <div>
                            <Button
                                text="Add"
                                disabled={this.state.selectedGroup === undefined}
                                onClick={this.submit}
                            />
                            <Button text="Cancel" onClick={this.props.onClose} />
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    submit = () => {
        if (this.state.selectedGroup) {
            this.props.onSubmit(this.state.selectedGroup);
            this.props.onClose();
        }
    };
}
