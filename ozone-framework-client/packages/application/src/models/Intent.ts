import { PropertiesOf } from "../types";

export class IntentProps {
    action: string;
    dataTypes: string[];

    constructor(props: PropertiesOf<IntentProps>) {
        Object.assign(this, props);
    }
}

export class Intent extends IntentProps {}
