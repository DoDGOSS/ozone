import { Model, Property } from "../../lib/openapi/decorators";


@Model({ name: "Intent" })
export class IntentDTO {

    @Property()
    action: string;

    @Property(() => String)
    dataTypes: string[];

}


@Model({ name: "Intents" })
export class IntentsDTO {

    @Property(() => IntentDTO)
    send: IntentDTO[];

    @Property(() => IntentDTO)
    receive: IntentDTO[];

}
