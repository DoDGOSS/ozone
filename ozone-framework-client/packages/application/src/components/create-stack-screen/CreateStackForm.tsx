import * as styles from "./index.scss";

import * as React from "react";
import { useState } from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";

import { stackApi } from "../../api/clients/StackAPI";
import { userDashboardApi } from "../../api/clients/UserDashboardAPI";

import { dashboardStore } from "../../stores/DashboardStore";
import { StackUpdateRequest } from "../../api/models/StackDTO";
import { UserDashboardStackDTO } from "../../api/models/UserDashboardDTO";

import { FormError, SubmitButton, TextField } from "../form";

import { handleSelectChange, handleStringChange, uuid } from "../../utility";

import { assetUrl } from "../../environment";

import { showToast } from "../toaster/Toaster";

export interface CreateStackFormProps {
    onSubmit: () => void;
}

export interface CreateStackOptions {
    name: string;
    imageUrl: string;
    description?: string;
}

export const CreateStackForm: React.FC<CreateStackFormProps> = ({ onSubmit }) => {
    // const [defaultDashOptsVisible, setDefaultDashOptsVisible] = useState(false);
    // const [initialDashOptionsSet, markInitialDashOptionsAsSet] = useState(false);

    return (
        <Formik
            initialValues={{
                name: "",
                imageUrl: "/images/dashboard.png",
                description: ""
            }}
            onSubmit={async (stackValues: CreateStackOptions, actions: FormikActions<CreateStackOptions>) => {
                const defaultDashValues = {
                    name: stackValues.name + " (default)",
                    description: "Default dashboard for stack `" + stackValues.name + "`",
                    presetLayoutName: null,
                    copyGuid: ""
                };
                const newDash = await dashboardStore.createDashboard(defaultDashValues);
                const userDashboardsResponse = await userDashboardApi.getOwnDashboards();
                if (userDashboardsResponse.status !== 200 || !userDashboardsResponse.data.dashboards) {
                    console.log("Could not create stack.");
                    showToast({
                        message: "Stack `" + stackValues.name + "` could not be created.",
                        intent: Intent.SUCCESS
                    });
                    return;
                }

                let newStack: UserDashboardStackDTO | undefined;

                for (const dash of userDashboardsResponse.data.dashboards) {
                    if (dash.guid === newDash.guid) {
                        newStack = dash.stack;
                    }
                }
                if (!newStack) {
                    return;
                }

                const newStackInfo: StackUpdateRequest = {
                    id: newStack.id,
                    name: stackValues.name,
                    imageUrl: stackValues.imageUrl,
                    approved: false,
                    stackContext: newStack.stackContext,
                    description: stackValues.description
                };

                const stackResponse = await stackApi.updateStack(newStackInfo);

                if (stackResponse.status !== 200 || !stackResponse.data.data || !(stackResponse.data.data.length > 0)) {
                    return;
                }

                onSubmit();
            }}
        >
            {(formik: FormikProps<CreateStackOptions>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <div className={styles.form}>
                        <div className={styles.formIcon}>
                            <img width="60px" src={assetUrl(formik.values.imageUrl)} />
                        </div>
                        <div className={styles.formField}>
                            <TextField name="name" label="Title" labelInfo="(required)" />
                            <TextField name="imageUrl" label="Icon Url" />
                            <TextField name="description" label="Description" />
                        </div>
                    </div>
                    {/* May implement later, but for now just make everything with a default dashboard. */}
                    {/* {defaultDashOptsVisible && !initialDashOptionsSet && (
                        <EditDashboardForm onsubmit={() => {markInitialDashOptionsAsSet(true)}}/>)
                    }

                    <Button
                        onClick={setDefaultDashOptsVisible(!defaultDashOptsVisible)}
                        text={defaultDashOptsVisible ? "Use default dashboard settings" : "Set initial dashboard options"}
                    /> */}

                    <SubmitButton />
                </Form>
            )}
        </Formik>
    );
};
