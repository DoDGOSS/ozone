import * as React from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import { CancelButton } from "../../../form";
import { WidgetEditForm } from "./WidgetEditForm";
// import { WidgetEditIntents } from "./WidgetEditIntents";
// import { WidgetEditGroups } from "./WidgetEditGroups";
// import { WidgetEditUsers } from "./WidgetEditUsers";
import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetUpdateRequest } from "../../../../api/models/WidgetDTO";

import * as styles from "../Widgets.scss";
import { WidgetTypeReference } from '../../../../api/models/WidgetTypeDTO';

export interface WidgetEditTabGroupProps {
    onUpdate: (update?: any) => void;
    onBack: () => void;
    widget: any;
    items: WidgetTypeReference[];
}

export interface WidgetEditTabGroupState {
    widget: any;
}

export class WidgetEditTabGroup extends React.Component<WidgetEditTabGroupProps, WidgetEditTabGroupState> {
    constructor(props: WidgetEditTabGroupProps) {
        super(props);

        this.state = {
            widget: props.widget
        };
    }

    render() {
        return (
            <div className={styles.actionBar}>
                <Tabs id="WidgetTabs">
                    <Tab
                        id="widget_properties"
                        title="Properties"
                        panel={<WidgetEditForm onUpdate={this.updateWidget} widget={this.state.widget} items={this.props.items}/>}
                    />
                    {/* <Tab
                        id="widget_intents"
                        title="Intents"
                        panel={<WidgetEditIntents onUpdate={this.updateWidget} widget={this.state.widget} />}
                    />
                    <Tab
                        id="widget_users"
                        title="Users"
                        panel={<WidgetEditUsers onUpdate={this.props.onUpdate} widget={this.state.widget} />}
                    />                    
                    <Tab
                        id="widget_groups"
                        title="Groups"
                        panel={<WidgetEditGroups onUpdate={this.props.onUpdate} widget={this.state.widget} />}
                    /> */}
                    <Tabs.Expander />
                    <span data-element-id="widget-admin-widget-edit-back-button">
                        <CancelButton onClick={this.props.onBack} />
                    </span>
                </Tabs>
            </div>
        );
    }

    private updateWidget = async (data: WidgetUpdateRequest) => {
        console.log("Submitting updated widget");

        const response = await widgetApi.updateWidget(data);
        const result = response.status === 200;

        this.props.onUpdate(response.data.data);

        return result;
    };
}
