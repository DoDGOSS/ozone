import * as React from "react";
import { Button, Dialog } from "@blueprintjs/core";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";
import * as uuidv4 from "uuid/v4";

import { CancelButton, CheckBox, FormError, SubmitButton, TextField } from "../../../form";
import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { Intent } from '../../../../models/Intent';
import { IntentForm } from './IntentForm';

import * as styles from "../Widgets.scss";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: any) => void;
    intentToEdit?: Intent;
}

export class IntentDialog extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {

        return (
        <Dialog
            title={this.getTitle()}
            className={styles.loginScreen}
            isOpen={this.props.isOpen}
            onClose={this.props.onClose}
        >
            <div>
                <IntentForm
                    intentToEdit={this.props.intentToEdit}
                    onSubmit={(newI: any) => {
                        this.props.onSubmit(newI);
                        this.props.onClose()}
                    }
                />
            </div>
        </Dialog>);
    }

    private getTitle(): string {
        if (this.props.intentToEdit) {
            return 'Edit Intent';
        }
        return 'Create Intent';
    }

    private getTheme() {
        return '';
    }
}
