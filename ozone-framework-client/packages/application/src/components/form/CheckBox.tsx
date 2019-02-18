import * as React from "react";

import { Field, FieldProps } from "formik";

import { Checkbox, FormGroup } from "@blueprintjs/core";

export interface CheckBoxProps {
    name: string;
    label?: string;
    labelInfo?: string;
    text?: string;
    defaultChecked?: boolean;
}

const _CheckBox: React.FunctionComponent<CheckBoxProps & FieldProps<any>> = (props) => (
    <FormGroup label={props.label} labelFor={props.name} labelInfo={props.labelInfo}>
        <Checkbox
            name={props.name}
            data-role="field"
            type="checkbox"
            label={props.text}
            defaultChecked={props.defaultChecked}
            {...props.field}
        />
    </FormGroup>
);

_CheckBox.displayName = "CheckBox";

export const CheckBox: React.FunctionComponent<CheckBoxProps> = (props) => (
    <Field name={props.name} component={_CheckBox} {...props} />
);
