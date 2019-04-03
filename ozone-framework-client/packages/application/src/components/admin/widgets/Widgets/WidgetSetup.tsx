import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";
import { MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";

import { CancelButton, CheckBox, FormError, HiddenField, SelectField, SubmitButton, TextField } from "../../../form";
import { WidgetCreateRequest, WidgetUpdateRequest, WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetCreatePanel } from "./WidgetCreatePanel";
import * as styles from "../Widgets.scss";

import { IntentsPanel } from './IntentsPanel'

const WidgetTypeSelect = SelectField.ofType<WidgetTypeReference>();

interface State {
    widgetExists: boolean,
    widget: any
}

interface Props {
    updatingWidget?: any,
    onReturn: () => void,
    widgetTypes: WidgetTypeReference[]
}

export class WidgetSetup extends React.Component<Props, State> {
    widget: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            widgetExists: (this.props.updatingWidget !== undefined),
            widget: this.props.updatingWidget ? this.props.updatingWidget.value : this.getDefaultWidget()
        };
        console.log(this.state.widget);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Tabs id="Tabs">
                <Tab id="create" title="Properties" panel={this.getCreatePanel()}/>
                <Tab id="intents" disabled={!this.state.widgetExists} title="Intents" panel={this.getIntentsPanel()}/>
                <Tab id="users" disabled={!this.state.widgetExists} title="Users" panel={<div/>} />
                <Tab id="groups" disabled={!this.state.widgetExists} title="Groups" panel={<div/>} />
                <Tabs.Expander />
            </Tabs>
        );
    }

    private saveWidget = async (widget: WidgetCreateRequest | WidgetUpdateRequest) => {
        console.log(widget)
        let response: any;
        if ('id' in widget) { // if widget is updateRequest. TS can't follow if I put the check in its own function though.
            response = await widgetApi.updateWidget(widget);
        }
        else {
            response = await widgetApi.createWidget(widget);
        }

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.props.onReturn();

        return true;
    };


    private onIntentsChange = (intentGroups: any) => {
        if (this.state.widget) {
            this.state.widget.intents = intentGroups;
            this.saveWidget(this.state.widget);
        }
    }

    private getIntentsPanel() {
        return <IntentsPanel
            updatingWidget={this.state.widget}
            onChange={this.onIntentsChange}
        />
    }

    // this can/should be encampsulated in the WidgetCreateForm file when building the import-via-url feature, if we have time.
    private getCreatePanel() {
        return <WidgetCreatePanel
            updatingWidget={this.state.widget}
            onSubmit={this.saveWidget}
            onReturn={this.props.onReturn}
            widgetTypes={this.props.widgetTypes}
        />
    }

    private getDefaultWidget(): WidgetCreateRequest {
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
            widgetTypes: [this.props.widgetTypes[1]], // assume more than one option. Default option of administrator breaks stuff.
            intents: {send: [], receive: []}
        }
    }
}
