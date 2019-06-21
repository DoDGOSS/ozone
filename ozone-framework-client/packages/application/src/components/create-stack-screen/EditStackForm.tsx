import * as styles from "./index.scss";

import * as React from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button } from "@blueprintjs/core";

import { StackDTO, StackUpdateRequest } from "../../api/models/StackDTO";

import { FormError, TextField } from "../form";

import { stackApi } from "../../api/clients/StackAPI";

import { assetUrl } from "../../environment";

export interface EditStackFormProps {
    onSubmit: () => void;
    stack: StackDTO;
}

export const EditStackForm: React.FC<EditStackFormProps> = ({ onSubmit, stack }) => {
    return (
        <Formik
            initialValues={stack}
            onSubmit={async (values: StackUpdateRequest, actions: FormikActions<StackUpdateRequest>) => {
                const isSuccess = [await stackApi.updateStack(values)];

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
            {(formik: FormikProps<StackUpdateRequest>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <div className={styles.form}>
                        <div className={styles.formIcon}>
                            <img width="60px" src={assetUrl(formik.values.imageUrl)} />
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
