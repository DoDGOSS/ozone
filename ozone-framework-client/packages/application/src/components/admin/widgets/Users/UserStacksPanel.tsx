import * as styles from "../Widgets.scss";

import * as React from "react";
import { Column } from "react-table";
import { Button, ButtonGroup, Intent, Position, Toaster } from "@blueprintjs/core";

import { GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton } from "../../../generic-table/TableButtons";
import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";

import { stackApi, StackQueryCriteria } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";
import { UserDTO } from "../../../../api/models/UserDTO";
import { UserStacksEditDialog } from "./UserStacksEditDialog";

interface UserEditStacksProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditStacksState {
    stacks: StackDTO[];
    loading: boolean;
    showAdd: boolean;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export class UserStacksPanel extends React.Component<UserEditStacksProps, UserEditStacksState> {
    defaultPageSize: number = 5;

    constructor(props: UserEditStacksProps) {
        super(props);
        this.state = {
            stacks: [],
            loading: true,
            showAdd: false
        };
    }

    componentDidMount() {
        this.getStacks();
    }

    render() {
        return (
            <div data-element-id="user-admin-add-stack">
                <GenericTable
                    items={this.state.stacks}
                    getColumns={() => this.getTableColumns()}
                    reactTableProps={{
                        loading: this.state.loading,
                        pageSize: this.defaultPageSize
                    }}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.showAdd()}
                        loading={this.state.loading}
                        data-element-id="user-edit-add-stack-dialog-add-button"
                    />
                </div>

                <UserStacksEditDialog show={this.state.showAdd} onSubmit={this.addStacks} onClose={this.closeDialog} />
            </div>
        );
    }

    private getTableColumns(): Column[] {
        return [
            { Header: "Title", accessor: "name" },
            { Header: "Pages (Dashboards)", accessor: "totalDashboards" },
            { Header: "Widgets", accessor: "totalWidgets" },
            { Header: "Groups", accessor: "totalGroups" },
            { Header: "Users", accessor: "totalUsers" },
            {
                Header: "Actions",
                Cell: (row: { original: StackDTO }) => (
                    <ButtonGroup>
                        <DeleteButton
                            onClick={() => this.confirmRemoveStack(row.original)}
                            itemName={row.original.name}
                        />
                    </ButtonGroup>
                )
            }
        ];
    }

    private showAdd() {
        this.setState({
            showAdd: true
        });
    }

    private getStacks = async () => {
        const currentUser: UserDTO = this.props.user;

        const criteria: StackQueryCriteria = {
            userId: currentUser.id
        };

        const response = await stackApi.getStacks(criteria);

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            stacks: response.data.data,
            loading: false
        });
    };

    private addStacks = async (stacks: Array<StackDTO>) => {
        for (const newStack of stacks) {
            const response = await stackApi.addStackUsers(newStack.id, [this.props.user]);
            if (response.status === 200) {
                OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
            } else {
                OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
                break;
            }
        }

        this.setState({
            showAdd: false,
            loading: true
        });

        this.getStacks();
        this.props.onUpdate();
    };

    private closeDialog = () => {
        this.setState({
            showAdd: false
        });
    };

    private confirmRemoveStack = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: stack.name, style: "bold" },
                " from user ",
                { text: this.props.user.username, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeStack(stack)
        });
    };

    private async removeStack(stack: StackDTO): Promise<boolean> {
        const response = await stackApi.removeStackUsers(stack.id, [this.props.user]);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.setState({
            loading: true
        });

        this.getStacks();
        this.props.onUpdate();

        return true;
    }
}
