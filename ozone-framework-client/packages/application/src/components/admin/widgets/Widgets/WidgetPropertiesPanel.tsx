import * as React from "react";

import axios from "axios";

import { WidgetCreateRequest, WidgetGetDescriptorResponse, WidgetUpdateRequest } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";

import { WidgetPropertiesForm } from "./WidgetPropertiesForm";

import { uuid } from "../../../../utility";
import { Button, InputGroup } from '@blueprintjs/core';

import * as styles from "./WidgetPropertiesPanel.scss";
import { Gateway, getGateway } from '../../../../api/interfaces';

export interface WidgetPropertiesPanelProps {
    widget: undefined | WidgetUpdateRequest;
    onSubmit: (data: WidgetCreateRequest | WidgetUpdateRequest) => Promise<boolean>;
    widgetTypes: WidgetTypeReference[];
}

interface WidgetPropertiesPanelState {
    showImportWidgetFromURL: boolean;
    descriptorURL: string;
    widget: undefined | WidgetCreateRequest;
}

export class WidgetPropertiesPanel extends React.Component<WidgetPropertiesPanelProps, WidgetPropertiesPanelState> {
    private readonly gateway: Gateway;

    constructor(props: WidgetPropertiesPanelProps) {
        super(props);

        this.state = {
            showImportWidgetFromURL: this.props.widget === undefined,
            descriptorURL: "",
            widget: undefined,
        };

        console.log(this.props.widgetTypes);
    }

    render() {
        let toDisplay = null;
        if (this.state.showImportWidgetFromURL) {
            toDisplay = (
                <div>
                    <span>Import widget from Descriptor URL</span>
                    <InputGroup
                        value={this.state.descriptorURL}
                        onChange={(e: any) => this.setState({ descriptorURL: e.target.value })}
                        data-element-id="descriptor-url-field"
                    />

                    <a
                    data-element-id="widget-admin-widget-show-properties-form"
                    onClick={() => {
                        this.setState({ showImportWidgetFromURL: false });
                    }}
                    >
                        Don't have a descriptor URL?
                    </a>

                    <div className={styles.flexBox}>
                        <span className={styles.fillSpace}/>
                        <span>
                            <Button disabled={!this.state.descriptorURL} onClick={(e: any) => this.loadDescriptor(this.state.descriptorURL)}>Load</Button>
                        </span>
                    </div>
                </div>
            );
        } else {
            // console.log(this.getWidget())
            toDisplay = (
                <WidgetPropertiesForm
                    currentWidget={this.getWidget()}
                    onSubmit={this.props.onSubmit}
                    widgetTypes={this.props.widgetTypes}
                />
            );
        }

        return <div>{toDisplay}</div>;
    }

    private async loadDescriptor(descriptorURL: string) {
        const response = await axios.get(descriptorURL, {
            withCredentials: true,
        });        
        
        const widgetData: WidgetGetDescriptorResponse = response.data;
        const createWidget: WidgetCreateRequest = {
            displayName: widgetData.displayName,
            widgetVersion: widgetData.widgetVersion,
            description: widgetData.description,
            widgetUrl: widgetData.widgetUrl,
            imageUrlSmall: widgetData.imageUrlSmall,
            imageUrlMedium: widgetData.imageUrlMedium,
            width: widgetData.width,
            height: widgetData.height,
            widgetGuid: uuid(),
            universalName: widgetData.universalName,
            visible: widgetData.visible,
            background: widgetData.background,
            singleton: widgetData.singleton,
            mobileReady: widgetData.mobileReady,
            widgetTypes: widgetData.widgetTypes.map((widgetType: string) => this.getWidgetType(widgetType)),
            intents: widgetData.intents
        };

        this.setState({ widget: createWidget });
        this.setState({showImportWidgetFromURL: false});
    }

    private getWidgetType(name: string): WidgetTypeReference {
        const type: WidgetTypeReference | undefined = this.props.widgetTypes.find((widgetType: WidgetTypeReference) => widgetType.name === name);
        if(!type) {
            return this.props.widgetTypes[0];
        }
        else {
            return type;
        }
    }

    private getWidget(): WidgetCreateRequest | WidgetUpdateRequest {
        // I used to have this in state, but the object wasn't re-created when I told it to re-render with new props.
        // So the state didn't change, causing the form to try to create the widget on submit, rather than update it.
        if(this.props.widget !== undefined) {
            return this.props.widget;
        }
        else if (this.state.widget !== undefined) {
            return this.state.widget;
        }
        else {
            return this.getBlankWidget();
        }
    }

    private getBlankWidget(): WidgetCreateRequest {
        const defaultType = this.props.widgetTypes.find((type) => type.name === "standard");
        if (!defaultType) {
            throw new Error("standard widget type not found");
        }

        return {
            displayName: "",
            widgetVersion: "",
            description: "",
            widgetUrl: "",
            imageUrlSmall: "",
            imageUrlMedium: "",
            width: 200,
            height: 200,
            widgetGuid: uuid(),
            universalName: "",
            visible: true,
            background: false,
            singleton: false,
            mobileReady: false,
            widgetTypes: [defaultType],
            intents: { send: [], receive: [] }
        };
    }
}
