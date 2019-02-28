import * as React from "react";

import { Field, FieldProps } from "formik";

import { FormGroup, InputGroup } from "@blueprintjs/core";

export interface TextFieldProps {
    name: string;
    label?: string;
    labelInfo?: string;
    type?: string;
    spellCheck?: boolean;

    className?: string;
    contentClassName?: string;
    fieldClassName?: string;
}

const _TextField: React.FunctionComponent<TextFieldProps & FieldProps<any>> = (props) => {
    return (
        <FormGroup
            className={props.className}
            contentClassName={props.contentClassName}
            label={props.label}
            labelFor={props.name}
            labelInfo={props.labelInfo}
        >
            <InputGroup
                className={props.fieldClassName}
                name={props.name}
                data-role="field"
                type={props.type}
                spellCheck={props.spellCheck || false}
                {...props.field}
            />
        </FormGroup>
    );
};

_TextField.displayName = "TextField";

export const TextField: React.FunctionComponent<TextFieldProps> = (props) => (
    <Field name={props.name} component={_TextField} {...props} />
);
