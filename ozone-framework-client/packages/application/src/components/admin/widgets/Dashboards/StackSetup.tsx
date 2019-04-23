import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackPropertiesPanel } from "./StackPropertiesPanel";
import { StackUsersPanel } from "./StackUsersPanel";
import { StackGroupsPanel } from "./StackGroupsPanel";
import { StackDTO, StackUpdateRequest } from "../../../../api/models/StackDTO";
import { CancelButton } from "../../../form/index";

import * as styles from "../Widgets.scss";

export interface StackSetupProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    stack: StackDTO | undefined;
}

export interface StackSetupState {
    stack: StackDTO | undefined;
}

export class StackSetup extends React.Component<StackSetupProps, StackSetupState> {
    constructor(props: StackSetupProps) {
        super(props);
        this.state = {
            stack: this.props.stack
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="DashboardTabs">
                    <Tab
                        id="dashboard_properties"
                        title="Properties"
                        panel={<StackPropertiesPanel saveStack={this.createOrUpdateStack} stack={this.state.stack} />}
                    />
                    <Tab
                        id="dashboard_groups"
                        title="Groups"
                        panel={<StackGroupsPanel onUpdate={this.props.onUpdate} stack={this.state.stack} />}
                    />
                    <Tab
                        id="dashboard_users"
                        title="Users"
                        panel={<StackUsersPanel onUpdate={this.props.onUpdate} stack={this.state.stack} />}
                    />
                    <Tabs.Expander />
                    <span data-element-id="dashboard-admin-widget-edit-back-button">
                        <CancelButton onClick={this.props.onBack} />
                    </span>
                </Tabs>
            </div>
        );
    }

    private createOrUpdateStack = async (stack: /*StackCreateRequest |*/ StackUpdateRequest) => {
        let response: any;
        if ("id" in stack) {
            response = await stackApi.updateStack(stack);
        } else {
            response = await stackApi.createStack(stack);
        }

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.props.onUpdate();

        return true;
    };

    private emptyIfStackNull(component: any): any {
        if (this.state.stack !== undefined) {
            return component;
        } else {
            return <div />;
        }
    }
}
