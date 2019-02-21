import * as styles from "../Widgets.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { UserUpdateRequest } from "../../../../api";
import { FormError, TextField } from "../../../form";
import { Button } from "@blueprintjs/core";

interface UserEditProps {
    onUpdate: (data: UserUpdateRequest) => Promise<boolean>;
    user?: any;
}

export const UserEditForm: React.FunctionComponent<UserEditProps> = ({ onUpdate, user }) => (
    <Formik
        initialValues={user}
        validationSchema={EditUserSchema}
        onSubmit={async (values: UserUpdateRequest, actions: FormikActions<UserUpdateRequest>) => {
            const isSuccess = await onUpdate(values);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);

            if (isSuccess) {
                actions.resetForm(values);
            }
        }}
    >
        {(formik: FormikProps<UserUpdateRequest>) => (
            <Form className={styles.form}>
                <div className={styles.formBody}>
                    <TextField name="username" label="Username" disabled={true} />
                    <TextField name="userRealName" label="Full Name" labelInfo="(required)" />
                    <TextField name="email" label="E-mail" labelInfo="(required)" />

                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}
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

const EditUserSchema = object().shape({
    userRealName: string().required("Required"),

    email: string()
        .required("Required")
        .email("Invalid e-mail address")
});
