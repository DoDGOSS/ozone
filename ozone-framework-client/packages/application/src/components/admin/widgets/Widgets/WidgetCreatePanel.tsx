import * as React from "react";
import ReactTable, { Column } from "react-table";
import { MenuItem, Tab, Tabs, Button } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { CancelButton, CheckBox, FormError, HiddenField, SelectField, SubmitButton, TextField } from "../../../form";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetCreateRequest, WidgetUpdateRequest } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { WidgetCreateForm } from "./WidgetCreateForm";

import * as styles from "../Widgets.scss";

interface State {
    showImportWidgetFromURL: boolean
}

interface Props {
    updatingWidget?: any,
    onSubmit: (data: WidgetCreateRequest) => Promise<boolean>,
    onReturn: () => void,
    widgetTypes: WidgetTypeReference[]
}


export class WidgetCreatePanel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showImportWidgetFromURL: (this.props.updatingWidget === undefined)
        };
    }

    render() {
        let toDisplay = null;
        if (this.state.showImportWidgetFromURL) {
            toDisplay = (
                <a
                    data-element-id="widget-admin-widget-show-create-form"
                    onClick={() => {
                        this.setState({ showImportWidgetFromURL: false });
                    }}
                >
                    Don't have a descriptor URL?
                </a>)
        }
        else {
            console.log(this.props.updatingWidget);
            toDisplay = <WidgetCreateForm
                currentWidgetValues={this.props.updatingWidget}
                onSubmit={this.props.onSubmit}
                widgetTypes={this.props.widgetTypes}
            />
        }

        return (
            <div>
                {toDisplay}
                <div data-element-id="widget-admin-widget-create-submit-button" className={styles.buttonBar}>
                    <CancelButton className={styles.cancelButton} onClick={this.props.onReturn} />
                </div>
            </div>
        )
    }
}
