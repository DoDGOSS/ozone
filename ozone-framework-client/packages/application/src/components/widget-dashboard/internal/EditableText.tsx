import React, { useCallback, useState } from "react";
import { useDoubleClick } from "../../../hooks";

import { handleStringChange } from "../../../utility";

export interface EditableTextProps {
    className?: string;
    disabled?: boolean;
    onChange: (nextValue: string) => void;
    value: string;
}

const _EditableText: React.FC<EditableTextProps> = (props) => {
    const { disabled, onChange, value } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState<string | null>(null);

    const enableEditing = useCallback(() => {
        if (!disabled) setIsEditing(true);
    }, [disabled, setIsEditing]);

    const onClick = useDoubleClick(250, enableEditing);

    const onValueUpdated = useCallback(handleStringChange(setNewValue), [setNewValue]);

    const onEditingComplete = useCallback(() => {
        if (newValue !== null && newValue !== value) {
            onChange(newValue);
        }
        setIsEditing(false);
    }, [value, newValue, setIsEditing]);

    const submitOnEnter = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter") onEditingComplete();
        },
        [onEditingComplete]
    );

    if (isEditing) {
        return (
            <input
                autoFocus
                type="text"
                value={newValue !== null ? newValue : value}
                onBlur={onEditingComplete}
                onChange={onValueUpdated}
                onKeyPress={submitOnEnter}
            />
        );
    }

    return (
        <div className={props.className} onClick={onClick}>
            {props.value}
        </div>
    );
};

export const EditableText = React.memo(_EditableText);
