import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { UserPropertiesPanel } from "./UserPropertiesPanel";
import { CancelButton } from "../../../form/index";
import { UserGroupsPanel } from "./UserGroupsPanel";
import { UserWidgetsPanel } from "./UserWidgetsPanel";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserUpdateRequest } from "../../../../api/models/UserDTO";
import { UserPreferencesPanel } from "./UserPreferencesPanel";

import * as styles from "../Widgets.scss";

export interface UserEditTabsProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    user: any;
}

export interface UserEditTabsState {
    user: any;
}

export class UserEditTabs extends React.Component<UserEditTabsProps, UserEditTabsState> {
    constructor(props: UserEditTabsProps) {
        super(props);

        this.state = {
            user: props.user
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="UserTabs">
                    <Tab
                        id="user_properties"
                        title="Properties"
                        panel={<UserPropertiesPanel onUpdate={this.updateGroup} user={this.state.user} />}
                    />
                    <Tab
                        id="user_groups"
                        title="Groups"
                        panel={<UserGroupsPanel onUpdate={this.props.onUpdate} user={this.state.user} />}
                    />
                    <Tab
                        id="user_widgets"
                        title="Widgets"
                        panel={<UserWidgetsPanel onUpdate={this.props.onUpdate} user={this.state.user} />}
                    />
                    <Tab
                        id="user_preferences"
                        title="Preferences"
                        panel={<UserPreferencesPanel onUpdate={this.props.onUpdate} user={this.state.user} />}
                    />
                    <Tabs.Expander />
                    <span data-element-id="user-admin-widget-edit-back-button">
                        <CancelButton onClick={this.props.onBack} />
                    </span>
                </Tabs>
            </div>
        );
    }

    private updateGroup = async (data: UserUpdateRequest) => {
        console.log("Submitting updated user");

        const response = await userApi.updateUser(data);
        const result = response.status === 200;

        this.props.onUpdate(response.data.data);

        return result;
    };
}
