import React, { Component } from "react";

import "./PreferencesWidget.scss";

import { Button, ButtonGroup, FormGroup, InputGroup, Intent, Position, TextArea, Toaster } from "@blueprintjs/core";
import { Field, FieldProps, Form, Formik, FormikActions, FormikProps } from "formik";

import { deleteUserPreference, getUserPreference, setUserPreference } from "../api/preferences";


interface Preference {
    namespace: string;
    path: string;
    value: string;
}

interface PreferenceWidgetState {
    preference: Preference;
}


const AppToaster = Toaster.create({
    position: Position.BOTTOM,
});


class PreferencesWidget extends Component<{}, PreferenceWidgetState> {

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
        this.fetchPreference(this.state.preference);
    }

    render() {
        const { preference } = this.state;

        return (
            <div className="app">
                <header>
                    Preferences API
                </header>
                <main className="content">
                    <Formik
                        initialValues={preference}
                        enableReinitialize={true}
                        onSubmit={this.savePreference}
                        render={(formik: FormikProps<Preference>) => (
                            <Form>
                                <Field name="namespace"
                                       render={({ field, form }: FieldProps<Preference>) => (
                                           <FormGroup label="Value">
                                               <InputGroup {...field}
                                                           spellCheck={false}/>
                                           </FormGroup>
                                       )}
                                />
                                <Field name="path"
                                       render={({ field, form }: FieldProps<Preference>) => (
                                           <FormGroup label="Preference">
                                               <InputGroup {...field}
                                                           spellCheck={false}/>
                                           </FormGroup>
                                       )}
                                />
                                <Field name="value"
                                       render={({ field, form }: FieldProps<Preference>) => (
                                           <FormGroup label="Value">
                                               <TextArea className="fill-width"
                                                         {...field}
                                                         spellCheck={false}/>
                                           </FormGroup>
                                       )}
                                />

                                <ButtonGroup>
                                    <Button text="Delete"
                                            icon="trash"
                                            onClick={async () => {
                                                await this.deletePreference(formik.values);
                                            }}/>

                                    <Button text="Refresh"
                                            icon="refresh"
                                            onClick={async () => {
                                                await this.fetchPreference(formik.values);
                                                formik.handleReset();
                                            }}/>

                                    <Button text="Save"
                                            icon="floppy-disk"
                                            onClick={formik.submitForm}
                                            disabled={formik.isSubmitting}/>
                                </ButtonGroup>
                            </Form>
                        )}/>
                </main>
            </div>
        );
    }

    private async fetchPreference(preference: Preference) {
        if (!this.validate(preference)) return;

        try {
            const result = await getUserPreference(preference.namespace, preference.path);
            this.setPreference(result);
        } catch (error) {
            this.setState({
                preference: { ...preference, value: "" }
            });
            AppToaster.show({ intent: Intent.WARNING, message: error });
        }
    }

    private async savePreference(preference: Preference, actions: FormikActions<Preference>) {
        if (!this.validate(preference)) return;

        try {
            const result = await setUserPreference(preference.namespace, preference.path, preference.value);
            this.setPreference(result);
            AppToaster.show({ intent: Intent.SUCCESS, message: `Saved: ${preference.namespace}/${preference.path}`})
        } catch (error) {
            AppToaster.show({ intent: Intent.WARNING, message: error });
        }
        actions.setSubmitting(false);
    }

    private async deletePreference(preference: Preference) {
        if (!this.validate(preference)) return;

        try {
            await deleteUserPreference(preference.namespace, preference.value);
            this.setPreference({ ...preference, value: "" });
            AppToaster.show({ intent: Intent.SUCCESS, message: `Deleted: ${preference.namespace}/${preference.path}`})
        } catch (error) {
            AppToaster.show({ intent: Intent.WARNING, message: error });
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

export default PreferencesWidget;
