import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { UserEditForm } from "./UserEditForm";
import { CancelButton } from "../../../form/index";
import { UserEditGroups } from "../Groups/UserEditGroups";
import { UserEditWidgets } from "../Widgets/UserEditWidgets";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserUpdateRequest } from "../../../../api/models/UserDTO";
import { UserEditPreferences } from "../Users/UserEditPreferences";

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
                        panel={<UserEditForm onUpdate={this.updateGroup} user={this.state.user} />}
                    />
                    <Tab
                        id="user_groups"
                        title="Groups"
                        panel={<UserEditGroups onUpdate={this.props.onUpdate} user={this.state.user} />}
                    />
                    <Tab
                        id="user_widgets"
                        title="Widgets"
                        panel={<UserEditWidgets onUpdate={this.props.onUpdate} user={this.state.user} />}
                    />
                    <Tab
                        id="user_preferences"
                        title="Preferences"
                        panel={<UserEditPreferences onUpdate={this.props.onUpdate} user={this.state.user} />}
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
