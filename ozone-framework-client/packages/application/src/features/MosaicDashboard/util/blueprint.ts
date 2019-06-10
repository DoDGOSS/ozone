import { Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

type ClassesKeys = typeof Classes;

type IconNamesKeys = typeof IconNames;

type BlueprintClass = { [K in keyof ClassesKeys]: ClassesKeys[K] extends string ? K : never }[keyof ClassesKeys];

export function getBlueprintClasses(...names: BlueprintClass[]): string {
    return names.map((name) => Classes[name]).join(" ");
}

export function getBlueprintIconClass(iconName: keyof IconNamesKeys): string {
    return Classes.iconClass(IconNames[iconName]);
}
