import * as React from "react";

import axios from "axios";

import {
    WidgetCreateRequest,
    WidgetDTO,
    WidgetGetDescriptorResponse,
    WidgetUpdateRequest
} from "../../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../../api/models/WidgetTypeDTO";

import { WidgetPropertiesForm } from "./WidgetPropertiesForm";

import { cleanNullableProp, uuid } from "../../../../../utility";
import { Button, InputGroup } from "@blueprintjs/core";

import * as styles from "./WidgetPropertiesPanel.scss";

export interface WidgetPropertiesPanelProps {
    widget: WidgetDTO | undefined;
    onSubmit: (data: WidgetCreateRequest | WidgetUpdateRequest) => Promise<boolean>;
    widgetTypes: WidgetTypeReference[];
}

interface WidgetPropertiesPanelState {
    widget: WidgetCreateRequest | WidgetUpdateRequest;
    showImportWidgetFromURL: boolean;
    descriptorURL: string;
    showError: boolean;
    errorMessage: string;
}

export class WidgetPropertiesPanel extends React.Component<WidgetPropertiesPanelProps, WidgetPropertiesPanelState> {
    constructor(props: WidgetPropertiesPanelProps) {
        super(props);

        this.state = {
            showImportWidgetFromURL: this.props.widget === undefined,
            descriptorURL: "",
            widget: this.getInitialValues(this.props.widget),
            showError: false,
            errorMessage: ""
        };
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
                        data-element-id="widget-admin-widget-descriptor-url-field"
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
                        <span
                            className={styles.fillSpace}
                            data-element-id="widget-admin-widget-descriptor-error-message"
                        >
                            {this.state.showError && <div className={styles.error}>{this.state.errorMessage}</div>}
                        </span>
                        <span>
                            <Button
                                disabled={!this.state.descriptorURL}
                                onClick={(e: any) => this.loadDescriptor(this.state.descriptorURL)}
                                data-element-id="widget-admin-widget-load-descriptor-button"
                            >
                                Load
                            </Button>
                        </span>
                    </div>
                </div>
            );
        } else {
            toDisplay = (
                <WidgetPropertiesForm
                    key={this.state.widget && "id" in this.state.widget ? this.state.widget["id"] : uuid()}
                    widget={this.state.widget}
                    onSubmit={this.props.onSubmit}
                    widgetTypes={this.props.widgetTypes}
                />
            );
        }

        return <div>{toDisplay}</div>;
    }

    private async loadDescriptor(descriptorURL: string) {
        this.setState({ errorMessage: "" });

        try {
            const response = await axios.get(descriptorURL, {
                withCredentials: true
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

            this.setState({
                showImportWidgetFromURL: false,
                widget: createWidget
            });
        } catch (err) {
            this.setState({
                showError: true,
                errorMessage: "Unable to retrieve descriptor information. Please check your URL and try again."
            });
        }
    }

    private getWidgetType(name: string): WidgetTypeReference {
        const type: WidgetTypeReference | undefined = this.props.widgetTypes.find(
            (widgetType: WidgetTypeReference) => widgetType.name === name
        );
        if (!type) {
            return this.props.widgetTypes[0];
        } else {
            return type;
        }
    }

    private getInitialValues(widget: WidgetDTO | undefined): WidgetCreateRequest | WidgetUpdateRequest {
        if (widget) {
            return this.convertDTOtoUpdateRequest(widget);
        } else {
            return this.getBlankWidget();
        }
    }

    private convertDTOtoUpdateRequest(dto: WidgetDTO): WidgetUpdateRequest {
        return {
            // apparently any string value of `""`, gets turned on the backend into `null`. Which breaks the form.
            id: dto.id,
            displayName: cleanNullableProp(dto.value.namespace),
            widgetVersion: cleanNullableProp(dto.value.widgetVersion),
            description: cleanNullableProp(dto.value.description),
            widgetUrl: cleanNullableProp(dto.value.url),
            imageUrlSmall: cleanNullableProp(dto.value.smallIconUrl),
            imageUrlMedium: cleanNullableProp(dto.value.mediumIconUrl),
            width: dto.value.width,
            height: dto.value.height,
            widgetGuid: dto.value.widgetGuid,
            universalName: cleanNullableProp(dto.value.universalName),
            visible: dto.value.visible,
            background: dto.value.background,
            singleton: dto.value.singleton,
            mobileReady: dto.value.mobileReady,
            widgetTypes: dto.value.widgetTypes,
            intents: dto.value.intents
        };
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
