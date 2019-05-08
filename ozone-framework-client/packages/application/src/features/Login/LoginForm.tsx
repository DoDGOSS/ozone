import styles from "./index.module.scss";

import React from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { FormError, SubmitButton, TextField } from "../../components/form";

import { authService } from "../../services/AuthService";

export interface LoginFormProps {
    onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = (props) => {
    return (
        <Formik
            initialValues={{
                username: "",
                password: ""
            }}
            validationSchema={LoginRequestSchema}
            onSubmit={async (values: LoginRequest, actions: FormikActions<LoginRequest>) => {
                actions.setSubmitting(false);

                const isSuccess = await authService.login(values.username, values.password);

                if (isSuccess) {
                    props.onSuccess();
                } else {
                    actions.setStatus({ error: "An unexpected error has occurred" });
                }
            }}
        >
            {(formik: FormikProps<LoginRequest>) => (
                <Form className={styles.form}>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <TextField name="username" label="Username" labelError={true} />
                    <TextField type="password" name="password" label="Password" labelError={true} />

                    <SubmitButton />
                </Form>
            )}
        </Formik>
    );
};

interface LoginRequest {
    username: string;
    password: string;
}

const LoginRequestSchema = object().shape({
    username: string()
        .matches(/^[a-zA-Z0-9_]+$/, { message: "Username must contain only alphanumeric or underscore characters." })
        .required("Required"),

    password: string().required("Required")
});
