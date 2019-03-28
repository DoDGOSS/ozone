import * as React from "react";

import { Field, FieldProps } from "formik";

import { FormGroup } from "@blueprintjs/core";

export interface HiddenFieldProps {
    name: string;
    label?: string;
    labelInfo?: string;
    text?: string;
    inline?: boolean;
    className?: string;
}

const _HiddenField: React.FC<HiddenFieldProps & FieldProps<any>> = (props) => (
    <FormGroup
        label={props.label}
        labelFor={props.name}
        labelInfo={props.labelInfo}
        inline={props.inline}
        className={props.className}
    >
        <span>{props.field.value}</span>
        <input name={props.name} data-role="field" type="hidden" {...props.field} />
    </FormGroup>
);

export const HiddenField: React.FC<HiddenFieldProps> = (props) => (
    <Field name={props.name} component={_HiddenField} {...props} />
);
