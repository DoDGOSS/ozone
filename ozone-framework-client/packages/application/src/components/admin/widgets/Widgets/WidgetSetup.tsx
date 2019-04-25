import * as React from "react";
import { Tab, Tabs } from "@blueprintjs/core";

import * as styles from "../Widgets.scss";
import { CancelButton } from "../../../form";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetCreateRequest, WidgetDTO, WidgetUpdateRequest } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { IntentDTO, IntentsDTO } from "../../../../api/models/IntentDTO";
import { User } from "../../../../models/User";
import { Group } from "../../../../models/Group";
import { cleanNullableProp } from "../../../../utility";

import { WidgetPropertiesPanel } from "./properties/WidgetPropertiesPanel";
import { IntentsPanel } from "./intents/IntentsPanel";
import { UsersPanel } from "./users/UsersPanel";
import { GroupsPanel } from "./groups/GroupsPanel";

export interface WidgetSetupProps {
    widget: WidgetDTO | undefined;
    onUpdate: () => void;
    onClose: () => void;
    widgetTypes: WidgetTypeReference[];
}

interface WidgetSetupState {
    widget: WidgetDTO | undefined;
}

export class WidgetSetup extends React.Component<WidgetSetupProps, WidgetSetupState> {
    constructor(props: WidgetSetupProps) {
        super(props);
        this.state = {
            widget: this.props.widget
        };
    }

    render() {
        return (
            <div>
                <Tabs id="Tabs">
                    <Tab id="properties" title="Properties" panel={this.getPropertiesPanel()} />
                    <Tab
                        id="intents"
                        disabled={!this.state.widget}
                        title="Intents"
                        panel={this.emptyIfWidgetNull(
                            <IntentsPanel updatingWidget={this.state.widget!} onIntentsChange={this.onIntentsChange} />
                        )}
                    />
                    <Tab
                        id="users"
                        disabled={!this.state.widget}
                        title="Users"
                        panel={this.emptyIfWidgetNull(
                            <UsersPanel widget={this.state.widget!} onUpdate={this.props.onUpdate} />
                        )}
                    />
                    <Tab
                        id="groups"
                        disabled={!this.state.widget}
                        title="Groups"
                        panel={this.emptyIfWidgetNull(
                            <GroupsPanel widget={this.state.widget!} onUpdate={this.props.onUpdate} />
                        )}
                    />
                    <Tabs.Expander />
                    <div data-element-id="widget-admin-widget-setup-return-button" className={styles.buttonBar}>
                        <CancelButton className={styles.cancelButton} onClick={this.props.onClose} />
                    </div>
                </Tabs>
            </div>
        );
    }

    getPropertiesPanel() {
        return (
            <WidgetPropertiesPanel
                widget={this.state.widget}
                onSubmit={this.createOrUpdateWidget}
                widgetTypes={this.props.widgetTypes}
            />
        );
    }

    createOrUpdateWidget = async (widget: WidgetCreateRequest | WidgetUpdateRequest) => {
        let response: any;
        if ("id" in widget) {
            response = await widgetApi.updateWidget(widget);
        } else {
            response = await widgetApi.createWidget(widget);
        }

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.setState({
            widget: response.data.data[0]
        });
        this.props.onUpdate();
        return true;
    };

    onIntentsChange = (intentGroups: IntentsDTO) => {
        if (this.state.widget) {
            this.state.widget.value.intents = intentGroups;
            this.createOrUpdateWidget(this.convertDTOtoUpdateRequest(this.state.widget));
        }
    };

    private emptyIfWidgetNull(component: any): any {
        if (this.state.widget !== undefined) {
            return component;
        } else {
            return <div />;
        }
    }

    // this is copied between here and widgetPropertiesPanel.
    // It's needed in both places, and the right way would probably be to switch this whole section over to using Widgets instead of WidgetDTOs
    private convertDTOtoUpdateRequest(dto: WidgetDTO): WidgetUpdateRequest {
        return {
            id: dto.id,
            displayName: cleanNullableProp(dto.value.namespace),
            widgetVersion: cleanNullableProp(dto.value.widgetVersion),
            description: cleanNullableProp(dto.value.description),
            widgetUrl: cleanNullableProp(dto.value.url),
            imageUrlSmall: cleanNullableProp(dto.value.smallIconUrl),
            imageUrlMedium: cleanNullableProp(dto.value.mediumIconUrl),
            width: dto.value.width,
            height: dto.value.height,
            widgetGuid: dto.id,
            universalName: cleanNullableProp(dto.value.universalName),
            visible: dto.value.visible,
            background: dto.value.background,
            singleton: dto.value.singleton,
            mobileReady: dto.value.mobileReady,
            widgetTypes: dto.value.widgetTypes,
            intents: dto.value.intents
        };
    }
}
