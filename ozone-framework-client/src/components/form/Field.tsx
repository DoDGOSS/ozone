import * as React from "react";
import * as styles from "./Form.scss";

import { Errors, FormContext, IntFormContext, Values } from "./Form";

import { FormGroup, InputGroup, Label } from "@blueprintjs/core";


export interface Validation {
    rule: (values: Values, fieldName: string, args: any) => string;
    args?: any;
}

// Available editors for the field
// !TODO Expand this functionality as needed
type Editor = "text" | "password" // "dropdown"

export interface FieldProps {
    // Unique field name
    id: string;

    // Label text for the field
    label?: string;

    // Editor for the field
    editor?: Editor;

    // Available dropdown items for the field
    options?: string[];

    // Field value
    value?: any;

    // Field validator
    validation?: Validation;
}

export const Field: React.SFC<FieldProps> = ({
    id,
    label,
    editor,
    options,
    value
}) => {

    // Gets the validation error for the field
    // @param {Errors} errors - All the errors from the form
    // @returns {string[]} - The validation error
    const getError = (errors: Errors): string => (errors ? errors[id] : "");

    // Gets the inline styles for editor
    // @param {IErrors} errors - All the errors from the form
    // @returns {any} - The style object
    const getEditorStyle = (errors: Errors): any =>
        getError(errors) ? { borderColor: "red" } : {};

    return (
        <FormContext.Consumer>
            { (context: IntFormContext) => (
                <FormGroup>
                    {label && <Label htmlFor={id}>{label}</Label>}
                    {getError(context.errors) && (
                        <div className={styles.formError}>
                            <p>{getError(context.errors)}</p>
                        </div>
                    )}
                    {editor!.toLowerCase() === "text" && (
                        <InputGroup
                            id={id}
                            type="text"
                            style={getEditorStyle(context.errors)}
                            value={value}
                            onChange={
                                (e: React.FormEvent<HTMLInputElement>) =>
                                    context.setValues({ [id]: e.currentTarget.value })
                            }
                            onBlur={() => context.validate(id)}
                        />
                    )}
                    {editor!.toLowerCase() === "password" && (
                        <InputGroup
                            id={id}
                            type="password"
                            style={getEditorStyle(context.errors)}
                            value={value}
                            onChange={
                                (e: React.FormEvent<HTMLInputElement>) =>
                                    context.setValues({ [id]: e.currentTarget.value })
                            }
                            onBlur={() => context.validate(id)}
                        />
                    )}
                    {/* TODO - Add more field types as needed */}
                </FormGroup>
            )}
        </FormContext.Consumer>
    );
};
Field.defaultProps = {
    editor: "text"
};