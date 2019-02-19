import * as React from "react";
import { Field, FieldProps } from "formik";
import { RadioGroup } from "@blueprintjs/core";
import { DEFAULT_LAYOUTS, IMAGE_ROOT_URL } from "../../stores/LayoutStore";
import * as styles from "./CreateDashboardStyles.scss";

export interface PremadeLayoutsProps {
    onChange: (event: React.FormEvent<HTMLElement>) => void;
    selectedValue?: string;
}

const _PremadeLayouts: React.FunctionComponent<PremadeLayoutsProps & FieldProps<any>> = ({ onChange }) => {
    return (
        <div className={styles.PremadeStyles} data-element-id="PremadeLayoutsList">
            <RadioGroup onChange={onChange}>
                {DEFAULT_LAYOUTS.map((Layout) => (
                    <button className="layout" key={Layout.name} value={Layout.name}>
                        <img src={IMAGE_ROOT_URL + Layout.iconUrl} />
                    </button>
                ))}
            </RadioGroup>
        </div>
    );
};

_PremadeLayouts.displayName = "PremadeLayouts";

export const PremadeLayouts: React.FunctionComponent<PremadeLayoutsProps> = (props) => (
    <Field component={_PremadeLayouts} {...props} />
);
