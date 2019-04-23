import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { GroupPropertiesPanel } from "./GroupPropertiesPanel";
import { GroupUsersPanel } from "./GroupUsersPanel";
import { GroupWidgetsPanel } from "./GroupWidgetsPanel";
import { CancelButton } from "../../../form/index";
import { GroupUpdateRequest } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";

import * as styles from "../Widgets.scss";

export interface GroupSetupProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    group: any;
}

export interface GroupSetupState {
    updatingGroup: any;
}

export class GroupSetup extends React.Component<GroupSetupProps, GroupSetupState> {
    constructor() {
        super(props);

        this.state = {
            updatingGroup: props.group
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="GroupTabs">
                    <Tab
                        id="group_properties"
                        title="Properties"
                        panel={
                            <GroupPropertiesPanel
                                onUpdate={this.updateGroup}
                                onSave={this.saveGroup}
                                group={this.state.group}
                            />
                        }
                    />
                    <Tab
                        id="group_users"
                        title="Users"
                        panel={<GroupUsersPanel onUpdate={this.props.onUpdate} group={this.state.group} />}
                    />
                    <Tab
                        id="group_widgets"
                        title="Widgets"
                        panel={<GroupWidgetsPanel onUpdate={this.props.onUpdate} group={this.state.group} />}
                    />
                    <Tabs.Expander />
                    <span data-element-id="group-admin-widget-edit-back-button">
                        <CancelButton onClick={this.props.onBack} />
                    </span>
                </Tabs>
            </div>
        );
    }

    private createOrUpdateGroup = async (group: GroupCreateRequest | GroupUpdateRequest) => {
        console.log("Submitting group");

        if (group.active === undefined) {
            group.status = group.status || "inactive";
        } else {
            group.status = group.active ? "active" : "inactive";
        }
        let response: any;
        if ("id" in group) {
            response = await groupApi.updateGroup(data);
        } else {
            response = await groupApi.createGroup(data);
        }

        if (
            response.status === 200 &&
            response.data &&
            response.data.data &&
            response.data.data.length !== undefined &&
            response.data.data.length > 0
        ) {
            this.setState({
                group: response.data.data[0]
            });
            this.props.onUpdate();
            return true;
        }
        return false;
    };
}
