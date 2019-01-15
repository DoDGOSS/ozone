import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { lazyInject } from "../../inject";
import { AuthStore } from "../../stores";

import { FormError, SubmitButton, TextField } from "../form";


export interface LoginFormProps {
    onSuccess: () => void;
}

export class LoginForm extends React.Component<LoginFormProps> {

    @lazyInject(AuthStore)
    private authStore: AuthStore;

    render() {
        return (
            <Formik
                initialValues={{
                    username: "",
                    password: ""
                }}
                validationSchema={LoginRequestSchema}
                onSubmit={async (values: LoginRequest, actions: FormikActions<LoginRequest>) => {
                    actions.setSubmitting(false);

                    const isSuccess = await this.authStore.login(values.username, values.password);

                    if (isSuccess) {
                        this.props.onSuccess();
                        actions.setStatus(null);
                    } else {
                        actions.setStatus({ error: "An unexpected error has occurred" });
                    }
                }}
            >
                {(formik: FormikProps<LoginRequest>) => (
                    <Form>
                        {formik.status && formik.status.error && <FormError message={formik.status.error}/>}

                        <TextField name="username" label="Username" labelInfo="(required)"/>
                        <TextField  type="password"
                                    name="password"
                                    label="Password"
                                    labelInfo="(required)"
                                    />

                        <SubmitButton/>
                    </Form>
                )}
            </Formik>
        );
    }

}

interface LoginRequest {
    username: string;
    password: string;
}


const LoginRequestSchema = object().shape({
    username: string().matches(/^[a-zA-Z0-9_]+$/, { message: "Username must contain only alphanumeric or underscore characters." })
                      .required("Required"),

    password: string().required("Required")
});
