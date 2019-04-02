import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { CancelButton, FormError, SubmitButton, TextField } from "../../../form";

import * as styles from "./UserCreateForm.scss";
import { PreferenceCreateRequest } from "../../../../api/models/PreferenceDTO";

interface PreferenceCreateProps {
    onSubmit: (data: PreferenceCreateRequest) => Promise<boolean>;
    onCancel: () => void;
}

export const PreferenceCreateForm: React.FunctionComponent<PreferenceCreateProps> = ({ onSubmit, onCancel }) => (
    <Formik
        initialValues={{
            namespace: "",
            path: "",
            value: ""
        }}
        validationSchema={CreatePreferenceSchema}
        onSubmit={async (values: PreferenceCreateRequest, actions: FormikActions<PreferenceCreateRequest>) => {
            const isSuccess = await onSubmit(values);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);
        }}
    >
        {(formik: FormikProps<PreferenceCreateRequest>) => (
            <Form className={styles.form}>
                <TextField name="namespace" label="Namespace" labelInfo="(required)" />
                <TextField name="path" label="Path" labelInfo="(required)" />
                <TextField name="value" label="Value" labelInfo="(required)" />

                {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                <div className={styles.buttonBar}>
                    <CancelButton className={styles.cancelButton} onClick={onCancel} />
                    <SubmitButton className={styles.submitButton} />
                </div>
            </Form>
        )}
    </Formik>
);

const CreatePreferenceSchema = object().shape({
    namespace: string().required("Required"),

    path: string().required("Required"),

    value: string().required("Required")
});
