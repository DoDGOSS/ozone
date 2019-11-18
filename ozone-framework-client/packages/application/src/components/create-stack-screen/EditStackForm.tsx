import * as styles from "./index.scss";

import * as React from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button, Intent, Position, Toaster } from "@blueprintjs/core";

import { StackDTO } from "../../api/models/StackDTO";

import { FormError, TextField } from "../form";

import { stackApi } from "../../api/clients/StackAPI";
import { userDashboardApi } from "../../api/clients/UserDashboardAPI";
import { dashboardApi } from "../../api/clients/DashboardAPI";

import { assetUrl } from "../../environment";

export interface EditStackFormProps {
    onSubmit: () => void;
    stack: StackDTO;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export const EditStackForm: React.FC<EditStackFormProps> = ({ onSubmit, stack }) => {
    const initialFormValues = getInitialValues(stack);
    return (
        <Formik
            initialValues={initialFormValues}
            onSubmit={async (values: StackDTO, actions: FormikActions<StackDTO>) => {
                let defaultDashboard;
                let dashSuccess = false;

                const userDashboardsResponse = await userDashboardApi.getOwnDashboards();
                if (
                    userDashboardsResponse.status >= 200 &&
                    userDashboardsResponse.status < 400 &&
                    userDashboardsResponse.data.dashboards !== undefined
                ) {
                    for (const dash of userDashboardsResponse.data.dashboards) {
                        if (!dash.stack) {
                            continue;
                        }
                        if (dash.stack.stackContext === stack.stackContext && dash.name === stack.name + " (default)") {
                            defaultDashboard = dash;
                        }
                    }
                    if (stack.name !== values.name && defaultDashboard !== undefined) {
                        const updatedDash: any = {
                            guid: defaultDashboard.guid,
                            name: values.name + " (default)"
                        };
                        dashSuccess = (await dashboardApi.updateDashboard(updatedDash)).status === 200;
                        if (!dashSuccess) {
                            OzoneToaster.show({
                                intent: Intent.DANGER,
                                message: "Could not rename default dashboard."
                            });
                            actions.setStatus({ error: "An unexpected error has occurred" });
                        }
                    }
                }

                stack.name = values.name;
                stack.imageUrl = values.imageUrl;
                stack.description = values.description;

                const isSuccess = [await stackApi.updateStack(stack)];

                actions.setSubmitting(false);
                if (isSuccess) {
                    OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
                    actions.setStatus(null);
                    onSubmit();
                } else {
                    OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
                    actions.setStatus({ error: "An unexpected error has occurred" });
                }
            }}
        >
            {(formik: FormikProps<StackDTO>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <div className={styles.form}>
                        <div className={styles.formIcon}>
                            <img width="60px" src={assetUrl(formik.values.imageUrl)} />
                        </div>
                        <div className={styles.formField}>
                            <TextField name="name" label="Title" labelInfo="(required)" />
                            <TextField name="imageUrl" label="Icon Url" />
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

function getInitialValues(stack: StackDTO): any {
    return {
        name: stack.name ? stack.name : "",
        imageUrl: stack.imageUrl ? stack.imageUrl : "",
        description: stack.description ? stack.description : ""
    };
}
