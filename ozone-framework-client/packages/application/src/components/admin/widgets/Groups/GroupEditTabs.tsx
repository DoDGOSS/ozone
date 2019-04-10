import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { GroupPropertiesPanel } from "./GroupPropertiesPanel";
import { GroupUsersPanel } from "./GroupUsersPanel";
import { CancelButton } from "../../../form/index";
import { GroupUpdateRequest } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";

import * as styles from "../Widgets.scss";

export interface GroupEditTabsProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    group: any;
}

export interface GroupEditTabsState {
    group: any;
    updated: boolean;
}

export class GroupEditTabs extends React.Component<GroupEditTabsProps, GroupEditTabsState> {
    constructor(props: GroupEditTabsProps) {
        super(props);

        this.state = {
            group: props.group,
            updated: false
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="GroupTabs">
                    <Tab
                        id="group_properties"
                        title="Properties"
                        panel={<GroupPropertiesPanel onUpdate={this.updateGroup} group={this.state.group} />}
                    />
                    <Tab
                        id="group_users"
                        title="Users"
                        panel={<GroupUsersPanel onUpdate={this.props.onUpdate} group={this.state.group} />}
                    />
                    <Tabs.Expander />
                    <span data-element-id="group-admin-widget-edit-back-button">
                        <CancelButton onClick={this.props.onBack} />
                    </span>
                </Tabs>
            </div>
        );
    }

    private updateGroup = async (data: GroupUpdateRequest) => {
        console.log("Submitting updated group");

        if (data.active === undefined) {
            data.status = data.status || "inactive";
        } else {
            data.status = data.active ? "active" : "inactive";
        }

        const response = await groupApi.updateGroup(data);
        const result = response.status === 200;

        this.props.onUpdate(response.data.data);

        return result;
    };
}
