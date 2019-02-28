import "./ChannelShouterWidget.scss";

import React, { Component } from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button } from "@blueprintjs/core";

import { TextField } from "../../../common/form/TextField";
import { TextArea } from "../../../common/form/TextArea";
import { SectionHeader } from "../../../common/SectionHeader";

interface Message {
    channel: string;
    value: string;
}

export class ChannelShouterWidget extends Component {
    render() {
        return (
            <div className="app flex-column">
                <SectionHeader text="Broadcast Channel Message" />

                <div className="flex-column flex-grow">
                    <Formik
                        initialValues={{
                            channel: "",
                            value: ""
                        }}
                        onSubmit={(message: Message, actions: FormikActions<Message>) => {
                            OWF.Eventing.publish(message.channel, message.value);
                            actions.setSubmitting(false);
                        }}
                        render={(formik: FormikProps<Message>) => (
                            <Form className="flex-column flex-grow">
                                <TextField name="channel" label="Channel" />

                                <TextArea
                                    name="value"
                                    label="Message"
                                    className="flex-grow"
                                    contentClassName="flex-column flex-grow"
                                    fieldClassName="flex-grow"
                                />

                                <Button
                                    text="Broadcast"
                                    icon="cell-tower"
                                    onClick={formik.submitForm}
                                    disabled={formik.isSubmitting}
                                />
                            </Form>
                        )}
                    />
                </div>
            </div>
        );
    }
}
