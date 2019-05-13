import * as styles from "./index.scss";

import * as React from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button } from "@blueprintjs/core";

import { DashboardUpdateRequest } from "../../api/models/DashboardDTO";

import { FormError, TextField } from "../form";

import { stackApi } from "../../api/clients/StackAPI";
import { dashboardApi } from "../../api/clients/DashboardAPI";

import { assetUrl } from "../../server";

export interface EditDashboardFormProps {
    onSubmit: () => void;
    dashboard: any;
}

export const EditDashboardForm: React.FC<EditDashboardFormProps> = ({ onSubmit, dashboard }) => {
    return (
        <Formik
            initialValues={dashboard}
            onSubmit={async (values: DashboardUpdateRequest, actions: FormikActions<DashboardUpdateRequest>) => {
                const stackData = {
                    id: values.stack!.id,
                    stackContext: values.stack!.stackContext,
                    name: values.name
                };

                const isSuccess = [await dashboardApi.updateDashboard(values), await stackApi.updateStack(stackData)];

                actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
                actions.setSubmitting(false);

                if (isSuccess) {
                    onSubmit();
                    actions.setStatus(null);
                } else {
                    actions.setStatus({ error: "An unexpected error has occurred" });
                }
            }}
        >
            {(formik: FormikProps<DashboardUpdateRequest>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <div className={styles.form}>
                        <div className={styles.formIcon}>
                            <img width="60px" src={assetUrl(formik.values.iconImageUrl)} />
                        </div>
                        <div className={styles.formField}>
                            <TextField name="name" label="Title" labelInfo="(required)" />
                            <TextField name="iconImageUrl" label="Icon Url" />
                            <TextField name="description" label="Description" />
                        </div>
                    </div>

                    <div className={styles.buttonBar}>
                        <Button
                            type="submit"
                            text="Apply"
                            data-element-id="form-submit-button"
                            disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
};
