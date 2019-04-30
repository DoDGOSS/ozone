import * as styles from "../Widgets.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { FormError, TextField } from "../../../form";
import { Button } from "@blueprintjs/core";
import { StackUpdateRequest } from "../../../../api/models/StackDTO";

interface StackEditProps {
    saveStack: (data: StackUpdateRequest) => Promise<boolean>;
    stack: any;
}

export const StackPropertiesPanel: React.FC<StackEditProps> = ({ saveStack, stack }) => (
    <Formik
        initialValues={stack}
        validationSchema={EditStackSchema}
        onSubmit={async (values: StackUpdateRequest, actions: FormikActions<StackUpdateRequest>) => {
            const isSuccess = await saveStack(values);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);

            if (isSuccess) {
                actions.resetForm(values);
            }
            // TODO broken here, see how other user-admin forms work
            // Also fix inputs to be "" if null, and double check that the description field is supposed to be required, and that the test data should
            // have nothing in that field. Seems like one of those things shouldn't be true.
        }}
    >
        {(formik: FormikProps<StackUpdateRequest>) => (
            <div data-element-id="dashboard-admin-widget-edit-form">
                <Form className={styles.form}>
                    <div className={styles.formBody}>
                        {" "}
                        <TextField name="name" label="Name" labelInfo="(required)" />
                        <TextField name="description" label="Description" labelInfo="(required)" />
                        {formik.status && formik.status.error && <FormError message={formik.status.error} />}
                    </div>

                    <div className={styles.buttonBar} data-element-id="dashboard-admin-widget-edit-submit-button">
                        <Button
                            type="submit"
                            text="Apply"
                            data-element-id="form-submit-button"
                            disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}
                        />
                    </div>
                </Form>
            </div>
        )}
    </Formik>
);

const EditStackSchema = object().shape({
    name: string().required("Required"),
    description: string().required("Required")
});
