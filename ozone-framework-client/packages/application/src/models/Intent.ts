export class IntentProps {
    action: string;
    dataTypes: string[];

    constructor(props: PropertiesOf<IntentProps>) {
        Object.assign(this, props);
    }
}

export class Intent extends IntentProps {}

export interface IntentInstance {
    action: string;
    dataType: string;
}
