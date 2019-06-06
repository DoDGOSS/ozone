import * as styles from "./index.scss";

import * as React from "react";
import { useState } from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";

import { stackApi } from "../../api/clients/StackAPI";

import { dashboardStore } from "../../stores/DashboardStore";
import { StackCreateRequest } from "../../api/models/StackDTO";

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
                const stackCreateInfo: StackCreateRequest = {
                    name: stackValues.name,
                    imageUrl: stackValues.imageUrl,
                    approved: false,
                    stackContext: uuid(),
                    description: stackValues.description
                };

                const stackResponse = await stackApi.createStack(stackCreateInfo);
                if (stackResponse.status !== 200 || !stackResponse.data.data || !(stackResponse.data.data.length > 0)) {
                    console.log("Could not create stack.");
                    showToast({
                        message: "Stack `" + stackCreateInfo.name + "` could not be created.",
                        intent: Intent.SUCCESS
                    });
                    return;
                }
                const stackID = stackResponse.data.data[0].id;

                const defaultDashValues = {
                    name: stackValues.name + " (default)",
                    description: "Default dashboard for stack `" + stackValues.name + "`",
                    presetLayoutName: null,
                    copyGuid: "",
                    stackId: stackID
                };
                const dashResponse = await dashboardStore.createDashboard(defaultDashValues);
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
