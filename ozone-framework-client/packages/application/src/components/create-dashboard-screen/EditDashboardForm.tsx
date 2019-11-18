import * as styles from "./index.scss";

import * as React from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button, Intent, Position, Toaster } from "@blueprintjs/core";

import { DashboardDTO, DashboardUpdateRequest } from "../../api/models/DashboardDTO";

import { FormError, TextField } from "../form";

import { stackApi } from "../../api/clients/StackAPI";
import { dashboardApi } from "../../api/clients/DashboardAPI";

import { assetUrl } from "../../environment";

export interface EditDashboardFormProps {
    onSubmit: () => void;
    dashboard: any;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export const EditDashboardForm: React.FC<EditDashboardFormProps> = ({ onSubmit, dashboard }) => {
    const initialFormValues = getInitialValues(dashboard);
    return (
        <Formik
            initialValues={initialFormValues}
            onSubmit={async (values: DashboardUpdateRequest, actions: FormikActions<DashboardUpdateRequest>) => {
                dashboard.name = values.name;
                // dashboard.iconImageUrl = values.iconImageUrl;
                dashboard.description = values.description;

                const response = await dashboardApi.updateDashboard(dashboard);

                actions.setSubmitting(false);

                if (response.status >= 200 && response.status < 400) {
                    OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
                    actions.setStatus(null);
                    onSubmit();
                } else {
                    OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
                    actions.setStatus({ error: "An unexpected error has occurred" });
                }
            }}
        >
            {(formik: FormikProps<DashboardUpdateRequest>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <div className={styles.form}>
                        {/* Removed due to bug on backend I couldn't fix; iconImageUrl is never saved. */}
                        {/* <div className={styles.formIcon}>
                            <img width="60px" src={assetUrl(formik.values.iconImageUrl)} />
                        </div> */}
                        <div className={styles.formField}>
                            <TextField name="name" label="Title" labelInfo="(required)" />
                            {/* <TextField name="iconImageUrl" label="Icon Url" /> */}
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

function getInitialValues(dash: DashboardDTO): any {
    return {
        name: dash.name ? dash.name : "",
        iconImageUrl: dash.iconImageUrl ? dash.iconImageUrl : "",
        description: dash.description ? dash.description : ""
    };
}
