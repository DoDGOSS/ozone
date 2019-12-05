import * as styles from "./index.scss";

import * as React from "react";

import { Field, FieldProps } from "formik";

import { assetUrl } from "../../environment";

import { DEFAULT_LAYOUTS } from "../../stores/default-layouts";

export interface PremadeLayoutsProps {
    onChange: (event: React.FormEvent<HTMLElement>) => void;
    selectedValue?: string;
}

const _PremadeLayouts: React.FC<PremadeLayoutsProps & FieldProps<any>> = (props) => {
    const { onChange, selectedValue } = props;

    return (
        <div className={styles.premadeLayout} data-element-id="PremadeLayoutsList">
            {DEFAULT_LAYOUTS.map((layout) => (
                <label key={layout.name} className={styles.premadeLayoutOption}>
                    <input
                        className={styles.premadeLayoutRadio}
                        type="radio"
                        onChange={onChange}
                        checked={layout.name === selectedValue}
                        value={layout.name}
                    />
                    <img className={styles.layoutIcon} src={assetUrl(layout.iconUrl)} />
                </label>
            ))}
        </div>
    );
};

export const PremadeLayouts: React.FC<PremadeLayoutsProps> = (props) => (
    <Field component={_PremadeLayouts} {...props} />
);
