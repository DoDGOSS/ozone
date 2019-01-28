import "./ChannelShouterWidget.scss";

import React, { Component } from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button, Navbar } from "@blueprintjs/core";

import { TextField } from "./form/TextField";
import { TextArea } from "./form/TextArea";


interface Message {
    channel: string;
    value: string;
}

class ChannelShouterWidget extends Component {

    render() {
        return (
            <div className="app flex-column">
                <Navbar className="section-header bp3-dark">
                    <Navbar.Group>
                        <Navbar.Heading>Broadcast Channel Message</Navbar.Heading>
                    </Navbar.Group>
                </Navbar>
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
                                <TextField name="channel"
                                           label="Channel"/>

                                <TextArea name="value"
                                          label="Message"
                                          className="flex-grow"
                                          contentClassName="flex-column flex-grow"
                                          fieldClassName="flex-grow"/>

                                <Button text="Broadcast"
                                        icon="cell-tower"
                                        onClick={formik.submitForm}
                                        disabled={formik.isSubmitting}/>
                            </Form>

                        )}
                    />
                </div>
            </div>
        );
    }

}

export default ChannelShouterWidget;
