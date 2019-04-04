import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";
import { MenuItem, Tab, Tabs } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";

import { CancelButton, FormError, SubmitButton } from "../../../form";
import { WidgetCreateRequest, WidgetUpdateRequest, WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetCreatePanel } from "./WidgetCreatePanel";
import * as styles from "../Widgets.scss";

import { IntentsPanel } from './IntentsPanel'


interface State {
    widgetExists: boolean,
    widget: any
}

interface Props {
    updatingWidget?: any,
    closeSetup: () => void,
    widgetTypes: WidgetTypeReference[]
}

export class WidgetSetup extends React.Component<Props, State> {
    widget: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            widgetExists: (this.props.updatingWidget !== undefined),
            widget: this.props.updatingWidget ? this.convertDTOtoUpdateRequest(this.props.updatingWidget) : undefined
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <Tabs id="Tabs">
                    <Tab id="properties" title="Properties" panel={this.getCreatePanel()}/>
                    <Tab id="intents" disabled={!this.state.widgetExists} title="Intents" panel={this.getIntentsPanel()}/>
                    <Tab id="users" disabled={!this.state.widgetExists} title="Users" panel={<div/>} />
                    <Tab id="groups" disabled={!this.state.widgetExists} title="Groups" panel={<div/>} />
                    <Tabs.Expander />
                </Tabs>
                <div data-element-id="widget-admin-widget-create-submit-button" className={styles.buttonBar}>
                    <CancelButton className={styles.cancelButton} onClick={this.props.closeSetup} />
                </div>
            </div>
        );
    }

    private saveWidget = async (widget: WidgetCreateRequest | WidgetUpdateRequest) => {
        let response: any;
        if ('id' in widget) { // if widget is updateRequest. TS can't follow if I put the check in its own function though.
            response = await widgetApi.updateWidget(widget);
        }
        else {
            response = await widgetApi.createWidget(widget);
        }

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.setState({
            widgetExists: true
        });
        this.props.closeSetup();

        return true;
    };


    private onIntentsChange = (intentGroups: any) => {
        if (this.state.widget) {
            this.state.widget.intents = intentGroups;
            this.saveWidget(this.state.widget);
        }
    }

    private getIntentsPanel() {
        if (this.state.widget) {
            return <IntentsPanel
                updatingWidget={this.state.widget}
                onChange={this.onIntentsChange}
            />
        }
        else {
            return <div/>
        }
    }

    // this can/should be encampsulated in the WidgetCreateForm file when building the import-via-url feature, if we have time.
    private getCreatePanel() {
        return <WidgetCreatePanel
            widget={this.state.widget}
            onSubmit={this.saveWidget}
            /* onReturn={this.props.closeSetup} */
            widgetTypes={this.props.widgetTypes}
        />
    }

    convertDTOtoUpdateRequest(dto: WidgetDTO): WidgetUpdateRequest {
        return { // apparently any string value of `""`, gets turned on the backend into `null`. Which breaks the form.
            id: dto.id,
            displayName: this.cleanDTOProp(dto.value.namespace),
            widgetVersion: this.cleanDTOProp(dto.value.widgetVersion),
            description: this.cleanDTOProp(dto.value.description),
            widgetUrl: this.cleanDTOProp(dto.value.url),
            imageUrlSmall: this.cleanDTOProp(dto.value.smallIconUrl),
            imageUrlMedium: this.cleanDTOProp(dto.value.mediumIconUrl),
            width: dto.value.width,
            height: dto.value.height,
            widgetGuid: dto.id,
            universalName: this.cleanDTOProp(dto.value.universalName),
            visible: dto.value.visible,
            background: dto.value.background,
            singleton: dto.value.singleton,
            mobileReady: dto.value.mobileReady,
            widgetTypes: dto.value.widgetTypes,
            intents: dto.value.intents
        }
    }

    cleanDTOProp(value: any) {
        if (value === null) {
            return "";
        }
        else {
            return value;
        }
    }
}
