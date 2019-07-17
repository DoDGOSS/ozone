import styles from "./index.scss";

import React, { useMemo } from "react";

import { Field, FieldProps } from "formik";

import { FormGroup, InputGroup, Intent } from "@blueprintjs/core";

import { classNames } from "../../utility";

export interface TextFieldProps {
    name: string;
    label?: string;
    labelInfo?: string;
    labelError?: boolean;
    type?: string;
    disabled?: boolean;
    placeholder?: string;
    inline?: boolean;
    className?: string;
}

const _TextField: React.FC<TextFieldProps & FieldProps<any>> = (props) => {
    const errors = props.form.errors[props.field.name];
    const showError = errors;

    const labelInfo = useMemo(() => {
        if (props.labelError === true) {
            return <span className={classNames(styles.labelValidationError, { show: showError })}>({errors})</span>;
        }
        return props.labelInfo;
    }, [props.labelInfo, props.labelError, showError]);

    return (
        <FormGroup
            label={props.label}
            labelFor={props.name}
            labelInfo={labelInfo}
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
            {props.labelError !== true && (
                <div className={classNames(styles.validationError, { show: showError })}>{errors}</div>
            )}
        </FormGroup>
    );
};

export const TextField: React.FC<TextFieldProps> = (props) => (
    <Field name={props.name} component={_TextField} {...props} />
);
