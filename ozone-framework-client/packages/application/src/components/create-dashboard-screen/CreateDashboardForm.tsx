import * as React from "react";
import { useState } from "react";

import { Form, Formik, FormikActions, FormikProps } from "formik";

import uuid from "uuid/v4";

import { Radio, RadioGroup } from "@blueprintjs/core";

import { dashboardApi } from "../../api/clients/DashboardAPI";

import { DashboardUpdateRequest } from "../../api/models/DashboardDTO";

import { FormError, SubmitButton, TextField } from "../form";

import { PremadeLayouts } from "./PremadeLayouts";
import { DashboardSelect } from "./DashboardSelect";

import { handleStringChange } from "../../utility";

import * as styles from "./index.scss";

export interface CreateDashboardFormProps {
    onSubmit: () => void;
}

export const CreateDashboardForm: React.FC<CreateDashboardFormProps> = ({ onSubmit }) => {
    const [selectedValue, setValue] = useState("");
    const handleRadioChange = handleStringChange(setValue);

    return (
        <Formik
            initialValues={{
                name: "",
                guid: uuid(),
                iconImageUrl: "https://cdn.onlinewebfonts.com/svg/img_301147.png",
                description: ""
            }}
            onSubmit={async (values: DashboardUpdateRequest, actions: FormikActions<DashboardUpdateRequest>) => {
                const isSuccess = await dashboardApi.createDashboard(values);
                if (isSuccess) {
                    onSubmit();
                    actions.setStatus(null);
                } else {
                    actions.setStatus({ error: "An unexpected error has occurred" });
                }
            }}
        >
            {(formik: FormikProps<DashboardUpdateRequest>) => (
                <Form>
                    {formik.status && formik.status.error && <FormError message={formik.status.error} />}

                    <div className={styles.form}>
                        <div className={styles.formIcon}>
                            <img width="60px" src={formik.values.iconImageUrl} />
                        </div>
                        <div className={styles.formField}>
                            <TextField name="name" label="Title" labelInfo="(required)" />
                            <TextField name="iconImageUrl" label="Icon Url" />
                            <TextField name="description" label="Description" />
                        </div>
                    </div>
                    <RadioGroup onChange={handleRadioChange} selectedValue={selectedValue}>
                        <Radio label="Choose a premade layout" value="premade" />
                        {selectedValue === "premade" && <PremadeLayouts onChange={handleRadioChange} />}
                        <Radio label="Copy the layout of an existing page" value="copy" />
                        {selectedValue === "copy" && <DashboardSelect />}
                        <Radio label="Create a new layout" value="new" />
                    </RadioGroup>

                    <SubmitButton />
                </Form>
            )}
        </Formik>
    );
};
