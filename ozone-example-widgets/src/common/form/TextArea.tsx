import * as React from "react";

import { Field, FieldProps } from "formik";

import { FormGroup, TextArea as TextAreaBP } from "@blueprintjs/core";

export interface TextAreaProps {
    name: string;
    label?: string;
    labelInfo?: string;
    type?: string;
    spellCheck?: boolean;

    className?: string;
    contentClassName?: string;
    fieldClassName?: string;
}

const _TextArea: React.FunctionComponent<TextAreaProps & FieldProps<any>> = (props) => {
    return (
        <FormGroup
            className={props.className}
            contentClassName={props.contentClassName}
            label={props.label}
            labelFor={props.name}
            labelInfo={props.labelInfo}
        >
            <TextAreaBP
                className={props.fieldClassName}
                name={props.name}
                data-role="field"
                spellCheck={props.spellCheck || false}
                {...props.field}
            />
        </FormGroup>
    );
};

_TextArea.displayName = "TextArea";

export const TextArea: React.FunctionComponent<TextAreaProps> = (props) => (
    <Field name={props.name} component={_TextArea} {...props} />
);
