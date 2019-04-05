import * as React from "react";
import ReactTable, { Column } from "react-table";
import { MenuItem, Tab, Tabs, Button } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { CancelButton, FormError, SubmitButton } from "../../../form";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetCreateRequest, WidgetUpdateRequest, WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { WidgetPropertiesForm } from "./WidgetPropertiesForm";

import * as styles from "../Widgets.scss";

interface State {
    showImportWidgetFromURL: boolean
}

interface Props {
    widget: undefined | WidgetUpdateRequest,
    onSubmit: (data: WidgetCreateRequest | WidgetUpdateRequest) => Promise<boolean>,
    widgetTypes: WidgetTypeReference[]
}


export class WidgetPropertiesPanel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showImportWidgetFromURL: (this.props.widget === undefined)
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
                </a>)
        }
        else {
            // console.log(this.getWidget())
            toDisplay = <WidgetPropertiesForm
                currentWidget={this.getWidget()}
                onSubmit={this.props.onSubmit}
                widgetTypes={this.props.widgetTypes}
            />
        }

        return (
            <div>
                {toDisplay}
            </div>
        )
    }

    private getWidget(): WidgetCreateRequest | WidgetUpdateRequest {
        // I used to have this in state, but the object wasn't re-created when I told it to re-render with new props.
        // So the state didn't change, causing the form to try to create the widget on submit, rather than update it.
        return (this.props.widget !== undefined) ? this.props.widget : this.getBlankWidget()
    }

    private getBlankWidget(): WidgetCreateRequest {
        let defaultType = this.props.widgetTypes.find(type => type.name === 'standard');
        if (defaultType === undefined && this.props.widgetTypes && this.props.widgetTypes.length > 0) {
            defaultType = this.props.widgetTypes[0];
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
            widgetGuid: uuidv4.default(),
            universalName: "",
            visible: true,
            background: false,
            singleton: false,
            mobileReady: false,
            widgetTypes: [defaultType],
            intents: {send: [], receive: []}
        }
    }
}
