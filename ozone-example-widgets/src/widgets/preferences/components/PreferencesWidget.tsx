import "./PreferencesWidget.scss";

import React, { Component } from "react";

import { Field, FieldProps, Form, Formik, FormikActions, FormikProps } from "formik";

import { Button, ButtonGroup, FormGroup, InputGroup, Intent, Position, TextArea, Toaster } from "@blueprintjs/core";

import { deleteUserPreference, getUserPreference, setUserPreference } from "../../../api/preferences";
import { SectionHeader } from "../../../common/SectionHeader";

interface Preference {
    namespace: string;
    path: string;
    value: string;
}

interface WidgetState {
    preference: Preference;
}

export class PreferencesWidget extends Component<{}, WidgetState> {
    constructor(props: any) {
        super(props);

        this.state = {
            preference: {
                namespace: "owf.sample.preferences",
                path: "test-preference-value",
                value: ""
            }
        };

        this.fetchPreference = this.fetchPreference.bind(this);
        this.savePreference = this.savePreference.bind(this);
        this.deletePreference = this.deletePreference.bind(this);
    }

    componentDidMount(): void {
        OWF.notifyWidgetReady();

        this.fetchPreference(this.state.preference);
    }

    render() {
        const { preference } = this.state;

        return (
            <div className="app flex-column">
                <SectionHeader text="Preferences" />

                <Formik
                    initialValues={preference}
                    enableReinitialize={true}
                    onSubmit={this.savePreference}
                    render={(formik: FormikProps<Preference>) => (
                        <Form className="flex-column flex-grow">
                            <Field
                                name="namespace"
                                render={({ field }: FieldProps<Preference>) => (
                                    <FormGroup label="Value">
                                        <InputGroup {...field} spellCheck={false} />
                                    </FormGroup>
                                )}
                            />
                            <Field
                                name="path"
                                render={({ field }: FieldProps<Preference>) => (
                                    <FormGroup label="Preference">
                                        <InputGroup {...field} spellCheck={false} />
                                    </FormGroup>
                                )}
                            />
                            <Field
                                name="value"
                                render={({ field }: FieldProps<Preference>) => (
                                    <FormGroup
                                        label="Value"
                                        className="flex-grow"
                                        contentClassName="flex-column flex-grow"
                                    >
                                        <TextArea className="flex-grow" {...field} spellCheck={false} />
                                    </FormGroup>
                                )}
                            />

                            <ButtonGroup fill={true}>
                                <Button
                                    text="Delete"
                                    icon="trash"
                                    onClick={async () => {
                                        await this.deletePreference(formik.values);
                                    }}
                                />

                                <Button
                                    text="Refresh"
                                    icon="refresh"
                                    onClick={async () => {
                                        await this.fetchPreference(formik.values);
                                        formik.handleReset();
                                    }}
                                />

                                <Button
                                    text="Save"
                                    icon="floppy-disk"
                                    onClick={formik.submitForm}
                                    disabled={formik.isSubmitting}
                                />
                            </ButtonGroup>
                        </Form>
                    )}
                />
            </div>
        );
    }

    private async fetchPreference(preference: Preference) {
        if (!this.validate(preference)) return;

        try {
            const result = await getUserPreference(preference.namespace, preference.path);
            this.setPreference(result);
        } catch (error) {
            reportError(error);
            this.setState({
                preference: { ...preference, value: "" }
            });
        }
    }

    private async savePreference(preference: Preference, actions: FormikActions<Preference>) {
        if (!this.validate(preference)) return;

        try {
            const result = await setUserPreference(preference.namespace, preference.path, preference.value);
            this.setPreference(result);
            AppToaster.show({ intent: Intent.SUCCESS, message: `Saved: ${preference.namespace}/${preference.path}` });
        } catch (error) {
            reportError(error);
        }
        actions.setSubmitting(false);
    }

    private async deletePreference(preference: Preference) {
        if (!this.validate(preference)) return;

        try {
            await deleteUserPreference(preference.namespace, preference.value);
            this.setPreference({ ...preference, value: "" });
            AppToaster.show({ intent: Intent.SUCCESS, message: `Deleted: ${preference.namespace}/${preference.path}` });
        } catch (error) {
            reportError(error);
        }
    }

    private validate(preference: Preference): boolean {
        if (preference.namespace.trim() === "") {
            AppToaster.show({ intent: Intent.WARNING, message: "Namespace is required" });
            return false;
        }

        if (preference.path.trim() === "") {
            AppToaster.show({ intent: Intent.WARNING, message: "Path is required" });
            return false;
        }

        return true;
    }

    private setPreference(preference: Preference) {
        this.setState({
            preference: {
                namespace: preference.namespace,
                path: preference.path,
                value: preference.value
            }
        });
    }
}

const AppToaster = Toaster.create({
    position: Position.BOTTOM
});

function reportError(error: Error) {
    AppToaster.show({ intent: Intent.WARNING, message: error.message });
    console.error(error);
}
