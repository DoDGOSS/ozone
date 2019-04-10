import * as React from "react";

import { WidgetCreateRequest, WidgetUpdateRequest } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";

import { WidgetPropertiesForm } from "./WidgetPropertiesForm";

import { uuid } from "../../../../utility";

export interface WidgetPropertiesPanelProps {
    widget: undefined | WidgetUpdateRequest;
    onSubmit: (data: WidgetCreateRequest | WidgetUpdateRequest) => Promise<boolean>;
    widgetTypes: WidgetTypeReference[];
}

interface WidgetPropertiesPanelState {
    showImportWidgetFromURL: boolean;
}

export class WidgetPropertiesPanel extends React.Component<WidgetPropertiesPanelProps, WidgetPropertiesPanelState> {
    constructor(props: WidgetPropertiesPanelProps) {
        super(props);
        this.state = {
            showImportWidgetFromURL: this.props.widget === undefined
        };
    }

    render() {
        let toDisplay = null;
        if (this.state.showImportWidgetFromURL) {
            toDisplay = (
                <a
                    data-element-id="widget-admin-widget-show-properties-form"
                    onClick={() => {
                        this.setState({ showImportWidgetFromURL: false });
                    }}
                >
                    Don't have a descriptor URL?
                </a>
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

    private getWidget(): WidgetCreateRequest | WidgetUpdateRequest {
        // I used to have this in state, but the object wasn't re-created when I told it to re-render with new props.
        // So the state didn't change, causing the form to try to create the widget on submit, rather than update it.
        return this.props.widget !== undefined ? this.props.widget : this.getBlankWidget();
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
