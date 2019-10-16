import * as React from "react";

import { Field, FieldProps } from "formik";

import { Checkbox, FormGroup } from "@blueprintjs/core";

export interface CheckBoxProps {
    name: string;
    label?: string;
    labelInfo?: string;
    text?: string;
    defaultChecked?: boolean;
    inline?: boolean;
    className?: string;
    disabled?: boolean;
}

const _CheckBox: React.FC<CheckBoxProps & FieldProps<any>> = (props) => (
    <FormGroup
        label={props.label}
        labelFor={props.name}
        labelInfo={props.labelInfo}
        inline={props.inline}
        className={props.className}
    >
        <Checkbox
            name={props.name}
            data-role="field"
            type="checkbox"
            label={props.text}
            defaultChecked={props.defaultChecked}
            disabled={props.disabled}
            {...props.field}
        />
    </FormGroup>
);

export const CheckBox: React.FC<CheckBoxProps> = (props) => (
    <Field name={props.name} component={_CheckBox} {...props} />
);
