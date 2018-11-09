import * as React from "react";

import { lazyInject } from "../../inject";
import { AuthStore } from "../../stores";

import { Fields, Form, required } from "../form/Form";
import { Field } from "../form/Field";


export class LoginForm extends React.Component {

    @lazyInject(AuthStore)
    private authStore: AuthStore;

    private fields: Fields = {
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
    };

    render() {
        const { username, password } = this.fields;

        return (
            <Form fields={this.fields}
                  onSubmit={this.login}>
                <Field {...username} />
                <Field {...password} />
            </Form>
        );
    }

    private login = async (data: LoginRequest) => {
        return this.authStore.login(data.username, data.password);
    }

}

export interface LoginRequest {
    username: string;
    password: string;
}


