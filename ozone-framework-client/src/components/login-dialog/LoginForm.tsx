import * as React from "react";
import { Fields, Form, required } from "../form/Form";
import { Field } from "../form/Field";

export const LoginForm: React.SFC = () => {

    const endPoint = "api/users/LOGIN_API_URL"
    const fields: Fields = {
        username: {
            id: "username",
            label: "Username",
            validation: { rule: required }
        },
        password: {
            id: "password",
            label: "Password",
            validation: { rule: required },
            editor: "password"
        }
    }

    return (
        <Form
            action={endPoint}
            fields={fields}
            // TODO - Remove lambda if necessary
            render={() => (
                <React.Fragment>
                    <Field {...fields.username} />
                    <Field {...fields.password} />
                </React.Fragment>
            )}
        />
    )
}