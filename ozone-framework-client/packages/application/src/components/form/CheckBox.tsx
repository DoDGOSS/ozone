// import * as styles from "./form.scss";

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

const _CheckBox: React.FunctionComponent<CheckBoxProps & FieldProps<any>> =
    ({ defaultChecked, name, label, labelInfo, field, form, text}) => {

        return (
            <FormGroup
                label={label}
                labelFor={name}
                labelInfo={labelInfo}
            >
                <Checkbox name={name}
                            data-role="field"
                            type="checkbox"
                            label={text}
                            defaultChecked={defaultChecked}
                            {...field}
                />

            </FormGroup>
        );
    };

_CheckBox.displayName = "CheckBox";


export const CheckBox: React.FunctionComponent<CheckBoxProps> = (props) => (
    <Field name={props.name} component={_CheckBox} {...props}/>
);
