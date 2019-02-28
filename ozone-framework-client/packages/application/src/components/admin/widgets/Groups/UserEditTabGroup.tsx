import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { UserEditForm } from "../Users/UserEditForm";
import { CancelButton } from "../../../form";
import { UserEditGroups } from "./UserEditGroups";
import { userApi } from "../../../../api/clients/UserAPI";
import { UserUpdateRequest } from "../../../../api/models/UserDTO";

import * as styles from "../Widgets.scss";

export interface UserEditTabGroupProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    user: any;
}

export interface UserEditTabGroupState {
    user: any;
}

export class UserEditTabGroup extends React.Component<UserEditTabGroupProps, UserEditTabGroupState> {
    constructor(props: UserEditTabGroupProps) {
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
