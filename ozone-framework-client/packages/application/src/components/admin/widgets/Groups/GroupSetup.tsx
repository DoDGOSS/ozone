import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { GroupPropertiesPanel } from "./GroupPropertiesPanel";
import { GroupUsersPanel } from "./GroupUsersPanel";
import { GroupWidgetsPanel } from "./GroupWidgetsPanel";
import { GroupStacksPanel } from "./GroupStacksPanel";
import { CancelButton } from "../../../form";

import { GroupCreateRequest, GroupDTO, GroupUpdateRequest } from "../../../../api/models/GroupDTO";
import { groupApi } from "../../../../api/clients/GroupAPI";

import * as styles from "../Widgets.scss";
import { Response } from "../../../../api/interfaces";

export interface GroupSetupProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    updatingGroup: GroupDTO | undefined;
}

export interface GroupSetupState {
    group: GroupDTO | undefined;
}

export class GroupSetup extends React.Component<GroupSetupProps, GroupSetupState> {
    constructor(props: GroupSetupProps) {
        super(props);

        this.state = {
            group: props.updatingGroup
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="GroupTabs">
                    <Tab
                        id="group_properties"
                        title="Properties"
                        panel={<GroupPropertiesPanel onSave={this.createOrUpdateGroup} group={this.state.group} />}
                    />
                    <Tab
                        id="group_users"
                        title="Users"
                        disabled={this.state.group === undefined}
                        panel={this.emptyIfGroupNull(
                            <GroupUsersPanel onUpdate={this.props.onUpdate} group={this.state.group!} />
                        )}
                    />
                    <Tab
                        id="group_widgets"
                        title="Widgets"
                        disabled={this.state.group === undefined}
                        panel={this.emptyIfGroupNull(
                            <GroupWidgetsPanel onUpdate={this.props.onUpdate} group={this.state.group!} />
                        )}
                    />
                    <Tab
                        id="group_stacks"
                        title="Stacks"
                        disabled={this.state.group === undefined}
                        panel={this.emptyIfGroupNull(
                            <GroupStacksPanel onUpdate={this.props.onUpdate} group={this.state.group!} />
                        )}
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
        if (group.active === undefined) {
            group.status = group.status || "inactive";
        } else {
            group.status = group.active ? "active" : "inactive";
        }
        let response: Response<GroupDTO>;
        if ("id" in group) {
            response = await groupApi.updateGroup(group);
        } else {
            response = await groupApi.createGroup(group);
        }

        if (response.status >= 200 && response.status < 400 && response.data) {
            this.setState({
                group: response.data
            });
            this.props.onUpdate();
            return true;
        }
        return false;
    };

    private emptyIfGroupNull(component: any): any {
        if (this.state.group !== undefined) {
            return component;
        } else {
            return <div />;
        }
    }
}
