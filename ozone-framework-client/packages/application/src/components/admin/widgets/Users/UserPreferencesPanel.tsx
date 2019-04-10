import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import { AdminTable } from "../../table/AdminTable";
import { UserDTO } from "../../../../api/models/UserDTO";
import { PreferenceCreateRequest, PreferenceDTO } from "../../../../api/models/PreferenceDTO";
import { preferenceApi } from "../../../../api/clients/PreferenceAPI";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
import { PreferenceCreateForm } from "./UserCreatePreferenceForm";

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
    showDelete: boolean;
    showCreate: boolean;
    showTable: boolean;
    confirmationMessage: string;
    managePreference: PreferenceDTO | undefined;
}

enum UserPreferenceWidgetSubSection {
    TABLE,
    CREATE,
    EDIT
}

export class UserPreferencesPanel extends React.Component<UserEditPreferencesProps, UserEditPreferencesState> {
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
            showCreate: false,
            showDelete: false,
            showTable: true,
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
        const showCreate = this.state.showCreate;
        const showTable = this.state.showTable;

        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter((row) => {
                return row.namespace.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="preference-admin-widget-dialog">
                {showTable && (
                    <>
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

                        <div className={styles.buttonBar}>
                            <Button
                                text="Create"
                                onClick={() => this.showSubSection(UserPreferenceWidgetSubSection.CREATE)}
                                data-element-id="user-admin-widget-create-button"
                            />
                        </div>
                    </>
                )}

                {showCreate && (
                    <PreferenceCreateForm
                        onSubmit={this.createPreference}
                        onCancel={() => {
                            this.showSubSection(UserPreferenceWidgetSubSection.TABLE);
                        }}
                    />
                )}

                {/* <UserEditPreferenceDialog
                    show={this.state.showAdd}
                    title="Add Preference(s) to User"
                    confirmHandler={this.handleAddPreferenceResponse}
                    cancelHandler={this.handleAddPreferenceCancel}
                    columns={UserEditPreferences.SELECT_PREFERENCES_COLUMN_DEFINITION}
                /> */}

                {/* <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.managePreference}
                />  */}
            </div>
        );
    }

    private showSubSection(subSection: UserPreferenceWidgetSubSection) {
        this.setState({
            showTable: subSection === UserPreferenceWidgetSubSection.TABLE,
            showCreate: subSection === UserPreferenceWidgetSubSection.CREATE
            // showEditUser: subSection === UserPreferenceWidgetSubSection.EDIT
        });
    }

    private getPreferences = async () => {
        const currentUser: UserDTO = this.state.user;

        const response = await preferenceApi.getPreferences();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            preferences: response.data.rows,
            loading: false
        });
    };

    private createPreference = async (data: PreferenceCreateRequest) => {
        const response = await preferenceApi.createPreference(data);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.showSubSection(UserPreferenceWidgetSubSection.TABLE);
        this.setState({ loading: true });
        this.getPreferences();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            managePreference: undefined
        });
    };
}
