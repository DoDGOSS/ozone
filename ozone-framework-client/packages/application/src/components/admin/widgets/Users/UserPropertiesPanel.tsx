import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";
import { Button, Intent, Position, Toaster } from "@blueprintjs/core";

import { FormError, TextField } from "../../../form";
import { UserCreateRequest, UserDTO, UserUpdateRequest } from "../../../../api/models/UserDTO";
import * as styles from "./UserPropertiesForm.scss";

interface UserPropertiesProps {
    saveUser: (data: UserCreateRequest | UserUpdateRequest) => Promise<boolean>;
    user: UserDTO | undefined;
}

const OzoneToaster = Toaster.create({
    position: Position.BOTTOM
});

export const UserPropertiesPanel: React.FC<UserPropertiesProps> = ({ saveUser, user }) => (
    <Formik
        initialValues={getInitialValues(user)}
        validationSchema={UserSchema}
        onSubmit={async (
            newUser: UserCreateRequest | UserUpdateRequest,
            actions: FormikActions<UserCreateRequest | UserUpdateRequest>
        ) => {
            const isSuccess = await saveUser(newUser);
            actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
            actions.setSubmitting(false);
            if (isSuccess) {
                OzoneToaster.show({ intent: Intent.SUCCESS, message: "Successfully Submitted!" });
                actions.resetForm(newUser);
            } else {
                OzoneToaster.show({ intent: Intent.DANGER, message: "Submit Unsuccessful, something went wrong." });
            }
        }}
    >
        {(formik: FormikProps<UserCreateRequest | UserUpdateRequest>) => (
            <Form className={styles.form}>
                <div className={styles.formBody}>
                    <TextField name="username" label="Username" disabled={user && user.id !== undefined} />
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

const UserSchema = object().shape({
    username: string()
        // .matches(/^[a-zA-Z0-9_]+$/, { message: "Username must contain only alphanumeric or underscore characters." })
        .required("Required"),

    userRealName: string().required("Required"),

    email: string()
        .required("Required")
        .email("Invalid e-mail address")
});

function getInitialValues(user: UserDTO | undefined): UserCreateRequest | UserUpdateRequest {
    if (user) {
        return convertDTOtoUpdateRequest(user);
    } else {
        return {
            username: "",
            userRealName: "",
            email: ""
        };
    }
}

function convertDTOtoUpdateRequest(user: UserDTO): UserUpdateRequest {
    return {
        id: user.id,
        username: user.username,
        userRealName: user.userRealName,
        email: user.email
    };
}
