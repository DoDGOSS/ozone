import React from "react";
import { ExpandButton } from "./ExpandButton";
import { RemoveButton } from "./RemoveButton";
import { ReplaceButton } from "./ReplaceButton";
import { SplitButton } from "./SplitButton";

export const DEFAULT_CONTROLS_WITH_CREATION = React.Children.toArray([
    <ReplaceButton key={1} />,
    <SplitButton key={2} />,
    <ExpandButton key={3} />,
    <RemoveButton key={4} />
]);

export const DEFAULT_CONTROLS_WITHOUT_CREATION = React.Children.toArray([
    <ExpandButton key={1} />,
    <RemoveButton key={2} />
]);
