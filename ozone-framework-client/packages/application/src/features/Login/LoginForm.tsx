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

                try {
                    const isSuccess = await authService.login(values.username, values.password);
                    if (isSuccess) {
                        props.onSuccess();
                    } else {
                        actions.setStatus({ error: "An unexpected error has occurred" });
                    }
                } catch (e) {
                    if (e.cause.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        if (e.hasOwnProperty("cause") && e.cause.hasOwnProperty("response")) {
                            actions.setStatus({ error: e.cause.response.data.nonFieldErrors[0] });
                        }
                    } else if (e.cause.request) {
                        // The request was made but no response was received
                        // `error.cause.request` is an instance of XMLHttpRequest in the
                        // browser and an instance of http.ClientRequest in node.js
                        actions.setStatus({ error: "Not connected to the internet or backend server is down." });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        actions.setStatus({ error: "An unexpected error has occurred" });
                    }
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
        // .matches(/^[a-zA-Z0-9_]+$/, { message: "Username must contain only alphanumeric or underscore characters." })
        .required("Required"),

    password: string().required("Required")
});
