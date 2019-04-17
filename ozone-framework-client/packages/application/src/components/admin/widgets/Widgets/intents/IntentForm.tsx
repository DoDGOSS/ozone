import * as React from "react";

import { Form, Formik, FormikProps } from "formik";
import * as yup from "yup";

import { Intent } from "../../../../../models/compat";

import { CheckBox, FormError, SubmitButton, TextField } from "../../../../form";

export interface IntentFormProps {
    onSubmit: (e: any) => void;
    intentToEdit?: Intent;
}

export const IntentForm: React.FunctionComponent<IntentFormProps> = (props) => {
    const intent: Intent = { action: "", dataType: "", send: false, receive: false };
    if (props.intentToEdit) {
        intent.action = props.intentToEdit.action;
        intent.dataType = props.intentToEdit.dataType;
        intent.send = props.intentToEdit.send;
        intent.receive = props.intentToEdit.receive;
    }
    return (
        <Formik initialValues={intent} validationSchema={IntentSchema} onSubmit={props.onSubmit}>
            {(formik: FormikProps<Intent>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <TextField type="text" name="action" label="Action" labelInfo="(required)" />
                    <TextField type="text" name="dataType" label="Data Type" labelInfo="(required)" />
                    <CheckBox name="send" label="Send" text="Send" defaultChecked={intent.send} />
                    <CheckBox name="receive" label="Receive" text="Receive" defaultChecked={intent.receive} />
                    <SubmitButton />
                </Form>
            )}
        </Formik>
    );
};

const IntentSchema = yup.object().shape({
    action: yup.string().required("Required"),
    dataType: yup.string().required("Required"),
    send: yup.boolean(),
    receive: yup.boolean()
});
