import * as React from "react";

import { Button, Callout, FormGroup } from "@blueprintjs/core";

import { FieldProps } from "./Field";


export interface IntFormContext extends FormState {
    // Allow values in values state to be set
    setValues: (values: Values) => void;

    // Function that validates a field
    validate: (fieldName: string) => void;
}

// Content which allows state and functions to be shared with Field
// Pass a default value to createContent
export const FormContext = React.createContext<IntFormContext | undefined>(
    undefined
);

// Basic validation
// Validates whether a field has a value
// @param {Values} vaules - All field values in form
// @param {string} fieldName - Field to validate
// @returns {string} - Error msg
export const required = (values: Values, fieldName: string): string =>
    values[fieldName] === undefined ||
    values[fieldName] === null ||
    values[fieldName] === ""
        ? "This field is required"
        : "";

export interface Fields {
    [key: string]: FieldProps;
}

interface FormProps<T> {
    // The props for all fields on the form
    fields: Fields;

    onSubmit: (data: T) => Promise<boolean>;

    children?: any;
}

export interface Values {
    // Key value pairs for all field values (key is the field name)
    [key: string]: any;
}

export interface Errors {
    // Form validation errors (key is the field name)
    [key: string]: string;
}

export interface FormState {
    values: Values;

    errors: Errors;

    submitSuccess?: boolean;
}

export class Form<T> extends React.Component<FormProps<T>, FormState> {

    state: FormState = {
        errors: {},
        values: {}
    };

    // Stores new field values in state
    // @param {Values} values - The new field values
    setValues = (values: Values) => {
        this.setState({ values: { ...this.state.values, ...values } });
    };

    // Returns whether there are any errors in the errors object that is passed in
    // *@param {Errors} errors - the field errors
    haveErrors(errors: Errors) {
        let haveError: boolean = false;
        Object.keys(errors).map((key: string) => {
            if (errors[key].length > 0) {
                haveError = true;
            }
        });
        return haveError;
    }

    // Handles form submission
    handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        console.log(this.state.values);

        if (this.validateForm()) {
            const submitSuccess: boolean = await this.submitForm();
            this.setState({ submitSuccess });
        }
    };

    // Executes the validation rule for the field and updates the form errors
    // @param {string} fieldName - Field to validate
    // @returns {string} - Error message
    validate = (fieldName: string): string => {
        let newError: string = "";

        if (
            this.props.fields[fieldName] &&
            this.props.fields[fieldName].validation
        ) {
            newError = this.props.fields[fieldName].validation!.rule(
                this.state.values,
                fieldName,
                this.props.fields[fieldName].validation!.args
            );
        }
        this.state.errors[fieldName] = newError;
        this.setState({
            errors: { ...this.state.errors, [fieldName]: newError }
        });
        return newError;
    };

    // Executes the validation rules for all the fields on the form and sets the error state
    // @returns {boolean} - Form is valid or not
    validateForm(): boolean {
        const errors: Errors = {};
        Object.keys(this.props.fields).map((fieldName: string) => {
            errors[fieldName] = this.validate(fieldName);
        });
        this.setState({ errors });
        return !this.haveErrors(errors);
    }

    // Submits form to API
    // @returns {boolean} - Form submission successful or not
    async submitForm(): Promise<boolean> {
        // Base axios
        try {
            return await this.props.onSubmit(this.state.values as T);
        } catch (ex) {
            return false;
        }
    }

    render() {
        const { submitSuccess, errors } = this.state;

        const context: IntFormContext = {
            ...this.state,
            setValues: this.setValues,
            validate: this.validate
        };

        const { children } = this.props;

        return (
            <FormContext.Provider value={context}>
                <form onSubmit={this.handleSubmit} noValidate={true}>
                    <div>
                        {submitSuccess && (
                            <Callout title="Success" intent="success">
                                The form was successfully submitted!
                            </Callout>
                        )}

                        {submitSuccess === false && !this.haveErrors(errors) && (
                            <Callout title="Error" intent="danger">
                                An unexpected error has occurred.
                            </Callout>
                        )}

                        {submitSuccess === false && this.haveErrors(errors) && (
                            <Callout title="Invalid Form" intent="warning">
                                Sorry, the form is invalid. Please review and try again.
                            </Callout>
                        )}

                        {children}

                        <FormGroup>
                            <Button type="submit"
                                    text="Submit"
                                    intent="primary"
                                    fill
                                    disabled={this.haveErrors(errors)}/>
                        </FormGroup>
                    </div>
                </form>
            </FormContext.Provider>

        );
    }
}
