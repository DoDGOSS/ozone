import * as React from "react";
import { Button, ButtonGroup, InputGroup, Intent } from "@blueprintjs/core";

import * as styles from "../Widgets.scss";

import { GenericTable } from "../../table/GenericTable";
import { DeleteButton, EditButton } from "../../table/TableButtons";
import { UserDTO } from "../../../../api/models/UserDTO";
import {
    PreferenceCreateRequest,
    PreferenceDeleteRequest,
    PreferenceDTO,
    PreferenceUpdateRequest
} from "../../../../api/models/PreferenceDTO";
import { preferenceApi } from "../../../../api/clients/PreferenceAPI";
import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";
import { UserPreferenceDialog } from "./UserPreferenceDialog";

interface UserEditPreferencesProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditPreferencesState {
    preferences: PreferenceDTO[];
    loading: boolean;
    preferenceSettingsDialog: React.ReactNode | undefined;
}

export class UserPreferencesPanel extends React.Component<UserEditPreferencesProps, UserEditPreferencesState> {
    defaultPageSize: number = 5;

    constructor(props: UserEditPreferencesProps) {
        super(props);
        this.state = {
            preferences: [],
            loading: true,
            preferenceSettingsDialog: undefined
        };
    }

    componentDidMount() {
        this.getPreferences();
    }

    render() {
        return (
            <div data-element-id="preference-admin-widget-panel">
                {this.state.preferenceSettingsDialog}

                <GenericTable
                    title={"Preferences"}
                    items={this.state.preferences}
                    getColumns={() => this.getTableColumns()}
                    reactTableProps={{
                        loading: this.state.loading,
                        defaultPageSize: this.defaultPageSize
                    }}
                />

                <div className={styles.buttonBar}>
                    <Button
                        text="Create"
                        onClick={() => this.showSettingsDialog()}
                        data-element-id="user-admin-widget-create-button"
                    />
                </div>
            </div>
        );
    }

    private getTableColumns(): any[] {
        return [
            { Header: "Namespace", accessor: "namespace" },
            { Header: "Path", accessor: "path" },
            { Header: "value", accessor: "value" },
            {
                Header: "Actions",
                Cell: (row: any) => (
                    <div>
                        <ButtonGroup>
                            <EditButton onClick={() => this.showSettingsDialog(row.original)} />
                            <DeleteButton onClick={() => this.confirmDeletePreference(row.original)} />
                        </ButtonGroup>
                    </div>
                )
            }
        ];
    }

    private showSettingsDialog(preferenceToEdit?: PreferenceUpdateRequest): void {
        this.setState({
            preferenceSettingsDialog: this.getPreferenceSettingsDialog(preferenceToEdit)
        });
    }

    private closeSettingsDialog(): void {
        this.setState({
            preferenceSettingsDialog: undefined
        });
    }

    private getPreferenceSettingsDialog(preferenceToEdit?: PreferenceUpdateRequest): React.ReactNode {
        return (
            <UserPreferenceDialog
                isOpen={true}
                onSubmit={this.createOrUpdate}
                onClose={() => this.closeSettingsDialog()}
                preferenceToEdit={preferenceToEdit}
            />
        );
    }

    private getPreferences = async () => {
        const response = await preferenceApi.getPreferences();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            preferences: response.data.rows,
            loading: false
        });
    };

    private createOrUpdate = async (pref: PreferenceCreateRequest | PreferenceUpdateRequest) => {
        console.log(pref);
        let response;
        if ("id" in pref) {
            response = await preferenceApi.updatePreference(pref);
        } else {
            response = await preferenceApi.createPreference(pref);
        }

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.setState({ loading: true });
        this.getPreferences();
    };

    private confirmDeletePreference = async (preference: PreferenceDeleteRequest) => {
        showConfirmationDialog({
            title: "Warning",
            message: "This action will permanently delete " + preference.path + ":" + preference.namespace + ".",
            onConfirm: () => this.deletePreference(preference)
        });

        return true;
    };

    private deletePreference = async (preference: PreferenceDeleteRequest) => {
        const response = await preferenceApi.deletePreference(preference);

        // TODO: Handle failed request
        if (response.status !== 200) return false;
        this.getPreferences();
        return true;
    };
}
