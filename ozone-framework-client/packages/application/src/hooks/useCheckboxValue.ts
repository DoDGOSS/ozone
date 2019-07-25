import React, { useMemo, useState } from "react";

import { handleBooleanChange } from "../utility";

export function useCheckboxValue(initialValue: boolean): [boolean, React.FormEventHandler<HTMLInputElement>] {
    const [state, setState] = useState(initialValue);

    const onChange = useMemo(() => handleBooleanChange(setState), []);

    return [state, onChange];
}
