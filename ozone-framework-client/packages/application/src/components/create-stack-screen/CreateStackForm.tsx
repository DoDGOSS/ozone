import * as React from "react";
import { useState } from "react";
import { Form, Formik, FormikProps } from "formik";
import { Radio, RadioGroup } from "@blueprintjs/core";
import { dashboardStore } from "../../stores/DashboardStore";
import { StackCreateRequest } from "../../api/models/StackDTO";
import { PremadeLayouts } from "../create-dashboard-screen/PremadeLayouts";
import { DashboardSelect } from "../create-dashboard-screen/DashboardSelect";
import { FormError, SubmitButton, TextField } from "../form";
import { handleSelectChange, handleStringChange } from "../../utility";
import { assetUrl } from "../../environment";
import * as styles from "./index.scss";

export interface CreateStackFormProps {
    onSubmit: () => void;
}

export interface CreateStackOptions {
    name: string;
    imageUrl: string;
    description?: string;
}

export const CreateStackForm: React.FC<CreateStackFormProps> = ({ onSubmit }) => {
    const [selectedLayoutInputSource, setSelectedLayoutInputSource] = useState("");
    const handleLayoutInputRadioChange = handleStringChange(setSelectedLayoutInputSource);

    const [selectedPresetLayout, setPresetLayout] = useState<string>();
    const handlePresetLayoutChange = handleStringChange(setPresetLayout);

    const [selectedCopyLayoutDashboardId, setCopyLayoutDashboardId] = useState<number>();
    const handleCopyLayoutChange = handleSelectChange(setCopyLayoutDashboardId);

    return (
        <Formik
            initialValues={{
                name: "",
                imageUrl: "/images/dashboard.png",
                description: ""
            }}
            onSubmit={async (stackValues: CreateStackOptions) => {
                const newStackInfo: StackCreateRequest = {
                    name: stackValues.name,
                    imageUrl: stackValues.imageUrl,
                    approved: false,
                    stackContext: "",
                    description: stackValues.description
                };

                const defaultDashLayout: { presetLayoutName?: string; copyId?: number } = {};

                if (selectedLayoutInputSource === "copy") {
                    defaultDashLayout.presetLayoutName = "copy";
                    defaultDashLayout.copyId = selectedCopyLayoutDashboardId;
                } else if (selectedLayoutInputSource === "premade") {
                    defaultDashLayout.presetLayoutName = selectedPresetLayout;
                }

                const stackCreationSuccess = await dashboardStore.createNewStack(newStackInfo, defaultDashLayout);
                if (!stackCreationSuccess) {
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

                    <RadioGroup onChange={handleLayoutInputRadioChange} selectedValue={selectedLayoutInputSource}>
                        <Radio label="Create a new layout for the initial dashboard" value="" />
                        <Radio label="Choose a pre-set layout" value="premade" />
                        {selectedLayoutInputSource === "premade" && (
                            <PremadeLayouts selectedValue={selectedPresetLayout} onChange={handlePresetLayoutChange} />
                        )}
                        <Radio label="Copy the layout of an existing dashboard" value="copy" />
                        {selectedLayoutInputSource === "copy" && (
                            <DashboardSelect
                                selectedValue={selectedCopyLayoutDashboardId}
                                onChange={handleCopyLayoutChange}
                            />
                        )}
                    </RadioGroup>

                    <SubmitButton />
                </Form>
            )}
        </Formik>
    );
};
