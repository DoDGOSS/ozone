import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { CancelButton, FormError, SubmitButton, TextField } from "../../../form";

import * as styles from "./UserCreateForm.scss";
import { UserCreateRequest } from "../../../../api/models/UserDTO";

interface UserCreateProps {
    onSubmit: (data: UserCreateRequest) => Promise<boolean>;
    onCancel: () => void;
}

export const UserCreateForm: React.FC<UserCreateProps> = ({ onSubmit, onCancel }) => (
    <Formik
        initialValues={{
            username: "",
            userRealName: "",
            email: ""
        }}
        validationSchema={CreateUserSchema}
        onSubmit={async (values: UserCreateRequest, actions: FormikActions<UserCreateRequest>) => {
            const isSuccess = await onSubmit(values);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);
        }}
    >
        {(formik: FormikProps<UserCreateRequest>) => (
            <Form className={styles.form}>
                <TextField name="username" label="Username" labelInfo="(required)" />
                <TextField name="userRealName" label="Full Name" labelInfo="(required)" />
                <TextField name="email" label="E-mail" labelInfo="(required)" />

                {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                <div className={styles.buttonBar}>
                    <CancelButton className={styles.cancelButton} onClick={onCancel} />
                    <SubmitButton className={styles.submitButton} />
                </div>
            </Form>
        )}
    </Formik>
);

const CreateUserSchema = object().shape({
    username: string()
        .matches(/^[a-zA-Z0-9_]+$/, { message: "Username must contain only alphanumeric or underscore characters." })
        .required("Required"),

    userRealName: string().required("Required"),

    email: string()
        .required("Required")
        .email("Invalid e-mail address")
});
