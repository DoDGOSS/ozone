import * as React from "react";

import { Fields, Form, isEmail, required } from "../../../form/Form";
import { Field } from "../../../form/Field";

interface UserCreateProps {
    createUser: any;
}

export class UserCreateForm extends React.Component<UserCreateProps> {

    private fields: Fields = {
        username: {
            id: "username",
            label: "Username",
            validation: { rule: required }
        },
        userRealName: {
            id: "userRealName",
            label: "Full Name",
            validation: { rule: required }
        },
        email: {
            id: "email",
            label: "Email",
            validation: { rule: isEmail }
        }
    };

    render() {
        const { username, userRealName, email } = this.fields;

        return (
            <Form fields={this.fields}
                  onSubmit={this.props.createUser}>
                <Field {...username} />
                <Field {...userRealName} />
                <Field {...email} />
            </Form>
        );
    }

}

