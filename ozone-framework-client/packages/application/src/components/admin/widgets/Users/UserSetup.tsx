import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { UserPropertiesPanel } from "./UserPropertiesPanel";
import { UserGroupsPanel } from "./UserGroupsPanel";
import { UserWidgetsPanel } from "./UserWidgetsPanel";
import { UserPreferencesPanel } from "./UserPreferencesPanel";

import { userApi } from "../../../../api/clients/UserAPI";
import { UserCreateRequest, UserDTO, UserUpdateRequest } from "../../../../api/models/UserDTO";
import { CancelButton } from "../../../form";

import * as styles from "../Widgets.scss";
import { UserStacksPanel } from "./UserStacksPanel";
import { Response } from "../../../../api/interfaces";

export interface UserSetupProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    user: UserDTO | undefined;
}

export interface UserSetupState {
    user: UserDTO | undefined;
}

// aka user-setup
export class UserSetup extends React.Component<UserSetupProps, UserSetupState> {
    constructor(props: UserSetupProps) {
        super(props);
        this.state = {
            user: this.props.user
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="UserTabs">
                    <Tab
                        id="user_properties"
                        title="Properties"
                        panel={<UserPropertiesPanel saveUser={this.createOrUpdate} user={this.state.user} />}
                    />
                    <Tab
                        id="user_groups"
                        title="Groups"
                        disabled={this.state.user === undefined}
                        panel={this.emptyIfUserNull(
                            <UserGroupsPanel onUpdate={this.props.onUpdate} user={this.state.user!} />
                        )}
                    />
                    <Tab
                        id="user_widgets"
                        title="Widgets"
                        disabled={this.state.user === undefined}
                        panel={this.emptyIfUserNull(
                            <UserWidgetsPanel onUpdate={this.props.onUpdate} user={this.state.user!} />
                        )}
                    />
                    <Tab
                        id="user_stacks"
                        title="Stacks"
                        disabled={this.state.user === undefined}
                        panel={this.emptyIfUserNull(
                            <UserStacksPanel onUpdate={this.props.onUpdate} user={this.state.user!} />
                        )}
                    />
                    <Tab
                        id="user_preferences"
                        title="Preferences"
                        disabled={this.state.user === undefined}
                        panel={this.emptyIfUserNull(
                            <UserPreferencesPanel onUpdate={this.props.onUpdate} user={this.state.user!} />
                        )}
                    />
                    <Tabs.Expander />
                    <span data-element-id="user-admin-widget-edit-back-button">
                        <CancelButton onClick={this.props.onBack} />
                    </span>
                </Tabs>
            </div>
        );
    }

    private createOrUpdate = async (user: UserCreateRequest | UserUpdateRequest): Promise<boolean> => {
        let response: Response<UserDTO>;

        if ("id" in user && user.hasOwnProperty("id")) {
            response = await userApi.updateUser(user);
        } else {
            response = await userApi.createUser(user);
        }

        if (response.status >= 200 && response.status < 400 && response.data) {
            this.setState({
                user: response.data
            });
            this.props.onUpdate();
            return true;
        }
        return false;
    };

    private emptyIfUserNull(component: any): any {
        if (this.state.user !== undefined) {
            return component;
        } else {
            return <div />;
        }
    }
}
