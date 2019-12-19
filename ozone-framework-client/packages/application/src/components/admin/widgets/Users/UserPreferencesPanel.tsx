import * as React from "react";
import { Button, ButtonGroup, Divider, Intent, Position, Toaster } from "@blueprintjs/core";

import * as styles from "../Widgets.scss";

import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { DeleteButton, EditButton } from "../../../generic-table/TableButtons";
import { UserDTO } from "../../../../api/models/UserDTO";
import { User } from "../../../../models/User";
import { userFromJson } from "../../../../codecs/User.codec";
import {
    PreferenceCreateRequest,
    PreferenceDeleteRequest,
    PreferenceDTO,
    PreferenceUpdateRequest
} from "../../../../api/models/PreferenceDTO";
import { preferenceApi } from "../../../../api/clients/PreferenceAPI";
import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { UserPreferenceDialog } from "./UserPreferenceDialog";
import { parseInt10 } from "../../../../utility";

interface UserEditPreferencesProps {
    onUpdate: (update?: any) => void;
    user: UserDTO;
}

export interface UserEditPreferencesState {
    preferences: PreferenceDTO[];
    loading: boolean;
    preferenceSettingsDialog: React.ReactNode | undefined;
    user: User;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export class UserPreferencesPanel extends React.Component<UserEditPreferencesProps, UserEditPreferencesState> {
    defaultPageSize: number = 5;

    constructor(props: UserEditPreferencesProps) {
        super(props);
        this.state = {
            preferences: [],
            loading: true,
            preferenceSettingsDialog: undefined,
            user: userFromJson(this.props.user)
        };
    }

    componentDidMount() {
        this.getPreferences(this.state.user.username);
    }

    render() {
        return (
            <div data-element-id="preference-admin-widget-panel">
                {this.state.preferenceSettingsDialog}

                <GenericTable
                    title={"Preferences"}
                    items={this.state.preferences}
                    getColumns={() => this.getTableColumns()}
                    tableProps={{
                        loading: this.state.loading,
                        paginationSize: this.defaultPageSize
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

    private getTableColumns(): ColumnTabulator[] {
        return [
            { title: "Namespace", field: "namespace" },
            { title: "Preference Name", field: "path" },
            { title: "value", field: "value" },
            {
                title: "Actions",
                responsive: 0,
                width: 180,
                formatter: (row: any) => {
                    const data: PreferenceDTO = row.cell._cell.row.data;
                    return (
                        <div>
                            <ButtonGroup>
                                <EditButton
                                    onClick={() =>
                                        this.showSettingsDialog({
                                            id: data.id,
                                            namespace: data.namespace,
                                            path: data.path,
                                            value: data.value,
                                            user: parseInt10(data.user.userId)
                                        } as PreferenceUpdateRequest)
                                    }
                                />
                                <Divider />
                                <DeleteButton
                                    onClick={() =>
                                        this.confirmDeletePreference({
                                            id: data.id,
                                            namespace: data.namespace,
                                            path: data.path,
                                            value: data.value,
                                            user: parseInt10(data.user.userId)
                                        } as PreferenceDeleteRequest)
                                    }
                                />
                            </ButtonGroup>
                        </div>
                    );
                }
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

    private getPreferences = async (username: string) => {
        const response = await preferenceApi.getPreferences();

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return;

        const preferencesForUser = response.data.data.filter((preference) => {
            return preference.user.userId === username;
        });

        this.setState({
            preferences: preferencesForUser,
            loading: false
        });
    };

    private createOrUpdate = async (pref: PreferenceCreateRequest | PreferenceUpdateRequest) => {
        let response;
        pref.user = this.state.user.id;
        if (pref.hasOwnProperty("user")) pref["user_id"] = pref["user"];

        if ("id" in pref) {
            response = await preferenceApi.updatePreference(pref);
        } else {
            response = await preferenceApi.createPreference(pref);
        }

        // TODO: Handle failed request
        if (response.status >= 200 && response.status < 400) {
            OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
        } else {
            OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
            return false;
        }

        this.setState({ loading: true });
        this.getPreferences(this.state.user.username);
    };

    private confirmDeletePreference = async (preference: PreferenceDeleteRequest) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will permanently delete ",
                { text: preference.namespace, style: "bold" },
                " : ",
                { text: preference.path, style: "bold" },
                "."
            ],
            onConfirm: () => this.deletePreference(preference)
        });

        return true;
    };

    private deletePreference = async (preference: PreferenceDeleteRequest) => {
        const response = await preferenceApi.deletePreference(preference);

        // TODO: Handle failed request
        if (!(response.status >= 200 && response.status < 400)) return false;
        this.getPreferences(this.state.user.username);
        return true;
    };
}
