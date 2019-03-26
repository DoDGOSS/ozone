import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";
import { UserDTO } from "../../../../api/models/UserDTO";
import { PreferenceDTO } from "../../../../api/models/PreferenceDTO";
import { preferenceApi } from "../../../../api/clients/PreferenceAPI";

interface UserEditPreferencesProps {
    onUpdate: (update?: any) => void;
    user: any;
}

export interface UserEditPreferencesState {
    preferences: PreferenceDTO[];
    filtered: PreferenceDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    user: any;
    showAdd: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    managePreference: PreferenceDTO | undefined;
}

export class UserEditPreferences extends React.Component<UserEditPreferencesProps, UserEditPreferencesState> {
    private static readonly SELECT_PREFERENCES_COLUMN_DEFINITION = [
        {
            Header: "Preferences",
            columns: [
                { Header: "Namespace", accessor: "namespace" },
                { Header: "Path", accessor: "path" },
                { Header: "value", accessor: "value" }
            ]
        }
    ];
    private readonly PREFERENCES_COLUMN_DEFINITION = [
        {
            Header: "Preferences",
            columns: [
                { Header: "Namespace", accessor: "namespace" },
                { Header: "Path", accessor: "path" },
                { Header: "value", accessor: "value" }
            ]
        },
        {
            Header: "Actions",
            Cell: (row: any) => (
                <div>
                    <ButtonGroup>
                        <Button
                            data-element-id="user-admin-widget-delete-preference-button"
                            text="Delete"
                            intent={Intent.DANGER}
                            icon="trash"
                            small={true}
                            // onClick={() => this.deletePreference(row.original)}
                        />
                    </ButtonGroup>
                </div>
            )
        }
    ];

    constructor(props: UserEditPreferencesProps) {
        super(props);
        this.state = {
            preferences: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            user: this.props.user,
            showAdd: false,
            showDelete: false,
            confirmationMessage: "",
            managePreference: undefined
        };
    }

    componentDidMount() {
        this.getPreferences();
    }

    render() {
        let data = this.state.preferences;
        const filter = this.state.filter.toLowerCase();

        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter((row) => {
                return row.namespace.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="preference-admin-widget-dialog">
                <div className={styles.actionBar}>
                    <InputGroup
                        placeholder="Search..."
                        leftIcon="search"
                        value={this.state.filter}
                        onChange={(e: any) => this.setState({ filter: e.target.value })}
                        data-element-id="search-field"
                    />
                </div>

                <div className={styles.table}>
                    <AdminTable
                        data={data}
                        columns={this.PREFERENCES_COLUMN_DEFINITION}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                </div>

                {/* <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.toggleShowAdd()}
                        data-element-id="preference-add-group-dialog-add-button"
                    />
                </div>

                <UserEditGroupsDialog
                    show={this.state.showAdd}
                    title="Add Group(s) to User"
                    confirmHandler={this.handleAddGroupResponse}
                    cancelHandler={this.handleAddGroupCancel}
                    columns={UserEditGroups.SELECT_GROUPS_COLUMN_DEFINITION}
                />

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageGroup}
                /> */}
            </div>
        );
    }

    private toggleShowAdd() {
        this.setState({
            showAdd: true
        });
    }

    private getPreferences = async () => {
        const currentUser: UserDTO = this.state.user;

        /* const criteria: PreferenceQueryCriteria = {
            user_id: currentUser.id
        }; */

        const response = await preferenceApi.getPreferences();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            preferences: response.data.rows,
            loading: false
        });
    };

    /* private handleAddGroupResponse = async (groups: Array<GroupDTO>) => {
        // const responses = await Promise.all(groups.map( async (group: GroupDTO) => {
        const responses = [];
        for (const group of groups) {
            const request: GroupUpdateRequest = {
                id: group.id,
                name: group.name,
                update_action: "add",
                user_ids: [this.state.user.id]
            };

            const response = await groupApi.updateGroup(request);

            if (response.status !== 200) return;

            responses.push(response.data.data);
        }

        this.setState({
            showAdd: false
        });

        this.getGroups();
        this.props.onUpdate(responses);

        return responses;
    };

    private handleAddGroupCancel = () => {
        this.setState({
            showAdd: false
        });
    };

    private deleteGroup = async (group: GroupDTO) => {
        const currentUser: UserDTO = this.state.user;

        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permanently delete <strong>${
                group.displayName
            }</strong> from the user <strong>${currentUser.userRealName}</strong>`,
            manageGroup: group
        });

        this.getGroups();

        return true;
    };

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined
        });

        const group: GroupDTO = payload;

        const request: GroupUpdateRequest = {
            id: group.id,
            name: group.name,
            update_action: "remove",
            user_ids: [this.state.user.id]
        };

        const response = await groupApi.updateGroup(request);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getGroups();
        this.props.onUpdate();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageGroup: undefined
        });
    }; */
}
