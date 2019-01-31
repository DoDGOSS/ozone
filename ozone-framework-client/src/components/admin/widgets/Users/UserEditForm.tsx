import * as styles from "./UserCreateForm.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { UserUpdateRequest } from "../../../../api";
import { CancelButton, FormError, SubmitButton, TextField } from "../../../form";


interface UserEditProps {
    onSubmit: (data: UserUpdateRequest) => Promise<boolean>;
    onCancel: () => void;
    user?: any;
}

export const UserEditForm: React.FunctionComponent<UserEditProps> =
    ({ onSubmit, onCancel, user }) => (
        <Formik
            initialValues={ user }
            validationSchema={EditUserSchema}
            onSubmit={async (values: UserUpdateRequest, actions: FormikActions<UserUpdateRequest>) => {
                const isSuccess = await onSubmit(values);
                actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
                actions.setSubmitting(false);
            }}
        >
            {(formik: FormikProps<UserUpdateRequest>) => (
                <Form className={styles.form}>
                    <TextField name="username" label="Username" disabled={true}/>
                    <TextField name="userRealName" label="Full Name" labelInfo="(required)"/>
                    <TextField name="email" label="E-mail" labelInfo="(required)"/>

                    {formik.status && formik.status.error && <FormError message={formik.status.error}/>}

                    <div className={styles.buttonBar}>
                        <CancelButton className={styles.cancelButton} onClick={onCancel}/>
                        <SubmitButton className={styles.submitButton}/>
                    </div>
                </Form>
            )}
        </Formik>
    );


const EditUserSchema = object().shape({

    userRealName: string().required("Required"),

    email: string().required("Required")
                   .email("Invalid e-mail address"),


});

