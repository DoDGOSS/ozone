import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { CancelButton, FormError, SubmitButton, TextField } from "../../../form";

import * as styles from "./UserPropertiesForm.scss";
import { PreferenceCreateRequest, PreferenceUpdateRequest } from "../../../../api/models/PreferenceDTO";

interface PreferenceFormProps {
    preferenceToEdit?: PreferenceUpdateRequest;
    onSubmit: (data: PreferenceCreateRequest | PreferenceUpdateRequest) => void;
    onClose: () => void;
}

export const UserPreferenceForm: React.FunctionComponent<PreferenceFormProps> = ({
    preferenceToEdit,
    onSubmit,
    onClose
}) => (
    <Formik
        initialValues={
            preferenceToEdit
                ? preferenceToEdit
                : {
                      namespace: "",
                      path: "",
                      value: ""
                  }
        }
        validationSchema={CreatePreferenceSchema}
        onSubmit={async (
            values: PreferenceCreateRequest | PreferenceUpdateRequest,
            actions: FormikActions<PreferenceCreateRequest | PreferenceUpdateRequest>
        ) => {
            const isSuccess = await onSubmit(values);
        }}
    >
        {(formik: FormikProps<PreferenceCreateRequest | PreferenceUpdateRequest>) => (
            <Form className={styles.form}>
                <TextField name="namespace" label="Namespace" labelInfo="(required)" />
                <TextField name="path" label="Path" labelInfo="(required)" />
                <TextField name="value" label="Value" labelInfo="(required)" />

                {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                <div className={styles.buttonBar}>
                    <CancelButton className={styles.cancelButton} onClick={onClose} />
                    <SubmitButton className={styles.submitButton} />
                </div>
            </Form>
        )}
    </Formik>
);

const CreatePreferenceSchema = object().shape({
    id: string().notRequired(),

    namespace: string().required("Required"),

    path: string().required("Required"),

    value: string().required("Required")
});
