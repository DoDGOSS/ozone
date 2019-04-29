import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { DashboardPropertiesPanel } from "./DashboardPropertiesPanel";
import { DashboardGroupsPanel } from "./DashboardGroupsPanel";
import { DashboardUsersPanel } from "./DashboardUsersPanel";
import { CancelButton } from "../../../form/index";
import { StackUpdateRequest } from "../../../../api/models/StackDTO";
import { stackApi } from "../../../../api/clients/StackAPI";

import * as styles from "../Widgets.scss";

export interface DashboardEditTabsProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    stack: any;
}

export interface DashboardEditTabsState {
    stack: any;
    updated: boolean;
}

export class DashboardEditTabs extends React.Component<DashboardEditTabsProps, DashboardEditTabsState> {
    constructor(props: DashboardEditTabsProps) {
        super(props);

        this.state = {
            stack: props.stack,
            updated: false
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="DashboardTabs">
                    <Tab
                        id="dashboard_properties"
                        title="Properties"
                        panel={<DashboardPropertiesPanel onUpdate={this.updateStack} stack={this.state.stack} />}
                    />
                    <Tab
                        id="dashboard_groups"
                        title="Groups"
                        panel={<DashboardGroupsPanel onUpdate={this.props.onUpdate} stack={this.state.stack} />}
                    />
                    <Tab
                        id="dashboard_users"
                        title="Users"
                        panel={<DashboardUsersPanel onUpdate={this.props.onUpdate} stack={this.state.stack} />}
                    />
                    <Tabs.Expander />
                    <span data-element-id="dashboard-admin-widget-edit-back-button">
                        <CancelButton onClick={this.props.onBack} />
                    </span>
                </Tabs>
            </div>
        );
    }

    private updateStack = async (data: StackUpdateRequest) => {
        console.log("Submitting updated dashboard");

        const response = await stackApi.updateStack(data);
        const result = response.status === 200;

        this.props.onUpdate(response.data.data);

        return result;
    };
}
