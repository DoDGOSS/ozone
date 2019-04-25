export class WidgetTypeProps {
    id: number;
    name: string;
    displayName: string;

    constructor(props: PropertiesOf<WidgetTypeProps>) {
        Object.assign(this, props);
    }
}

export class WidgetType extends WidgetTypeProps {}
