import * as React from "react";

import { Field, FieldProps } from "formik";

import { FormGroup, InputGroup, Intent } from "@blueprintjs/core";

import * as styles from "./index.scss";

export interface TextFieldProps {
    name: string;
    label?: string;
    labelInfo?: string;
    type?: string;
    disabled?: boolean;
    placeholder?: string;
    inline?: boolean;
    className?: string;
}

const _TextField: React.FunctionComponent<TextFieldProps & FieldProps<any>> = (props) => {
    const errors = props.form.errors[props.field.name];
    const showError = errors && props.form.touched[props.field.name];

    return (
        <FormGroup
            label={props.label}
            labelFor={props.name}
            labelInfo={props.labelInfo}
            inline={props.inline}
            className={props.className}
        >
            <InputGroup
                name={props.name}
                data-role="field"
                type={props.type}
                intent={showError ? Intent.DANGER : Intent.NONE}
                {...props.field}
                disabled={props.disabled}
                placeholder={props.placeholder}
            />
            {showError && <div className={styles.validationError}>{errors}</div>}
        </FormGroup>
    );
};

_TextField.displayName = "TextField";

export const TextField: React.FunctionComponent<TextFieldProps> = (props) => (
    <Field name={props.name} component={_TextField} {...props} />
);
