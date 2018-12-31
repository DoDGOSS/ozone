import * as styles from "./form.scss";

import * as React from "react";
import { Field, FieldProps } from "formik";
import { FormGroup, InputGroup, Intent } from "@blueprintjs/core";


export interface TextFieldProps {
    name: string;
    label?: string;
    labelInfo?: string;
}


const _TextField: React.FunctionComponent<TextFieldProps & FieldProps<any>> =
    ({ name, label, labelInfo, field, form }) => {
        const errors = form.errors[field.name];
        const showError = errors && form.touched[field.name];

        return (
            <FormGroup
                label={label}
                labelFor={name}
                labelInfo={labelInfo}
            >
                <InputGroup name={name}
                            data-role="field"
                            type="text"
                            intent={showError ? Intent.DANGER : Intent.NONE}
                            {...field}
                />
                {showError && (<div className={styles.validationError}>{errors}</div>)}
            </FormGroup>
        );
    };

_TextField.displayName = "TextField";


export const TextField: React.FunctionComponent<TextFieldProps> = (props) => (
    <Field name={props.name} component={_TextField} {...props}/>
);
