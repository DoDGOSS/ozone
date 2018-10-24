import * as React from "react";
import axios from 'axios';
import { Button, FormGroup } from "@blueprintjs/core";

import { FieldProps } from "./Field";

export interface IntFormContext extends FormState {
    // Allow values in values state to be set
    setValues: (values: Values) => void;

    // Function that validates a field
    validate: (fieldName: string) => void;
}

// Content which allows state and functions to be shared with Field
// Pass a default value to createContent
export const FormContext = React.createContext<IntFormContext | undefined> (
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
    [key: string]: FieldProps
}

interface FormProps {
    action: string;

    // The props for all fields on the form
    fields: Fields;

    // A prop which allows content to be injected
    render: () => React.ReactNode
}

export interface Values {
    // Key value pairs for all field values (key is the field name)
    [key: string]: any;
}

export interface Errors {
    // Form validation errors (key is the field name)
    [key: string]: string
}

export interface FormState {
    values: Values;

    errors: Errors;

    submitSuccess?: boolean;
}

export class Form extends React.Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);

        const errors: Errors = {};
        const values: Values = {};
        this.state = {
            errors,
            values
        };
    }

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
    handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
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
    }

    // Executes the validation rules for all the fields on the form and sets the error state
    // @returns {boolean} - Form is valid or not
     validateForm(): boolean {
        const errors: Errors = {};
        Object.keys(this.props.fields).map((fieldName: string) => {
            errors[fieldName] = this.validate(fieldName);
         });
        this.setState({errors});
        return !this.haveErrors(errors)
    }

    // Submits form to API
    // @returns {boolean} - Form submission successful or not
    async submitForm(): Promise<boolean> {

        // Base axios
        try {
            // const response = await axios.post(this.props.action, this.state.values);
            const response = await axios.get('http://google.com');
            return response.data;
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
        }
        return (
            <FormContext.Provider value={context}>
                <form onSubmit={this.handleSubmit} noValidate={true}>
                    <div>

                        {submitSuccess && (
                            <div className="bp3-callout bp3-intent-success">
                                <h4 className="bp3-heading"> Success </h4>
                                The form was successfully submitted!
                            </div>
                        )}

                        {submitSuccess === false &&
                        !this.haveErrors(errors) && (
                            <div className="bp3-callout bp3-intent-danger">
                                <h4 className="bp3-heading"> Error </h4>
                                An unexpected error has occurred
                            </div>
                        )}

                        {submitSuccess === false &&
                        this.haveErrors(errors) && (
                            <div className="bp3-callout bp3-intent-warning">
                                <h4 className="bp3-heading"> Invalid Form </h4>
                                Sorry, the form is invalid. Please review and try again.
                            </div>
                        )}

                        {/* Render injected content */}
                        {this.props.render()}

                        <FormGroup>
                            <Button
                                type="submit"
                                className="bp3-intent-primary bp3-fill"
                                text="Submit"
                                disabled={this.haveErrors(errors)}
                            />
                        </FormGroup>

                    </div>
                </form>
            </FormContext.Provider>

        );
    }
}