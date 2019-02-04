import styles from "./ChannelListenerWidget.module.scss";

import React, { Component } from "react";

import { Field, FieldProps, Form, Formik, FormikActions, FormikProps } from "formik";

import { Button, FormGroup, InputGroup} from "@blueprintjs/core";

import ReactDataGrid from "react-data-grid";

import { SectionHeader } from "../../../common/SectionHeader";


interface Subscription {
    channel: string;
}

interface Activity {
    sender: any;
    channel: string;
    message: string;
    timestamp: number;
}


interface WidgetState {
    subscriptions: Subscription[];
    activities: Activity[];
}

export class ChannelListenerWidget extends Component<{}, WidgetState> {

    private activityLogColumns = [
        {
            key: "timestamp",
            name: "Timestamp",
            resizable: true,
            width: 200,
            formatter: TimestampFormatter
        },
        {
            key: "channel",
            name: "Channel",
            resizable: true,
            width: 200
        },
        {
            key: "message",
            name: "Message",
            resizable: true
        }
    ];

    private subscriptionColumns = [
        {
            key: "channel",
            name: "Channel",
            formatter: this.getSubscriptionCellFormatter().bind(this)
        }
    ];

    constructor(props: any) {
        super(props);

        this.state = {
            subscriptions: [],
            activities: [],
        };

        this.addSubscription = this.addSubscription.bind(this);
        this.clearActivities = this.clearActivities.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    addSubscription(channel: string): void {
        const { subscriptions } = this.state;

        if (subscriptions.find((s) => s.channel === channel)) return;

        this.setState({
            subscriptions: subscriptions.concat({ channel })
        });

        OWF.Eventing.subscribe(channel, this.onMessage);
    }

    removeSubscription(channel: string): void {
        const { subscriptions } = this.state;

        this.setState({
            subscriptions: subscriptions.filter(s => s.channel !== channel)
        });

        OWF.Eventing.unsubscribe(channel);
    }

    onMessage(sender: any, message: string, channel: string): void {
        const { activities } = this.state;

        const activity: Activity = {
            sender,
            message,
            channel,
            timestamp: Date.now()
        };

        this.setState({
            activities: activities.concat(activity)
        });
    }

    clearActivities(): void {
        this.setState({
            activities: []
        });
    }

    render() {
        return (
            <div className={styles.app}>
                <div>
                    <SectionHeader text="Channel Subscriptions"/>

                    <Formik
                        initialValues={{
                            channel: ""
                        }}
                        onSubmit={(subscription: Subscription, actions: FormikActions<Subscription>) => {
                            this.addSubscription(subscription.channel);
                            actions.setSubmitting(false);
                        }}
                        render={(formik: FormikProps<Subscription>) => (
                            <Form>
                                <Field name="channel"
                                       render={({ field }: FieldProps<Subscription>) => (
                                           <FormGroup inline={true}
                                                      className={styles.addChannelInput}>
                                               <InputGroup {...field}
                                                           placeholder="Add channel name..."
                                                           spellCheck={false}
                                                           rightElement={
                                                               <Button icon="plus"
                                                                       minimal={true}
                                                                       onClick={formik.submitForm}/>
                                                           }
                                               />
                                           </FormGroup>
                                       )}
                                />
                            </Form>
                        )}
                    />

                    <ReactDataGrid
                        columns={this.subscriptionColumns}
                        rowGetter={i => this.state.subscriptions[i]}
                        rowsCount={this.state.subscriptions.length}
                        minHeight={150}
                    />
                </div>

                <div>
                    <SectionHeader text="Activity Log">
                        <Button text="Clear"
                                minimal={true}
                                onClick={this.clearActivities}/>
                    </SectionHeader>

                    <ReactDataGrid
                        columns={this.activityLogColumns}
                        rowGetter={i => this.state.activities[i]}
                        rowsCount={this.state.activities.length}
                        minHeight={200}
                    />
                </div>
            </div>
        );
    }

    private getSubscriptionCellFormatter() {
        return (row: any) => (
            <div className={styles.subscriptionCell}>
                <span>{row.value}</span>
                <Button icon="cross"
                        minimal={true}
                        onClick={() => this.removeSubscription(row.value)}/>
            </div>
        );
    }

}


const TimestampFormatter = (row: any) => <span>{(new Date(row.value)).toISOString()}</span>;
