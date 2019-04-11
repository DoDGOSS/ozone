import * as styles from "../Widgets.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { CheckBox, FormError, TextField } from "../../../form";
import { Button } from "@blueprintjs/core";
import { StackUpdateRequest } from "../../../../api/models/StackDTO";

interface DashboardEditProps {
    onUpdate: (data: StackUpdateRequest) => Promise<boolean>;
    stack: any;
}

export const DashboardPropertiesPanel: React.FC<DashboardEditProps> = ({ onUpdate, stack }) => (
    <Formik
        initialValues={stack}
        validationSchema={EditDashboardSchema}
        onSubmit={async (values: StackUpdateRequest, actions: FormikActions<StackUpdateRequest>) => {
            const isSuccess = await onUpdate(values);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);

            if (isSuccess) {
                actions.resetForm(values);
            }
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

const EditDashboardSchema = object().shape({
    name: string().required("Required"),
    description: string().required("Required")
});
