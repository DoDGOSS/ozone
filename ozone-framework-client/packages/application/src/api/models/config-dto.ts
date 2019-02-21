import { createArrayValidator, createValidator, Model, Property } from "@ozone/openapi-decorators";

@Model({ name: "Config" })
export class ConfigDTO {
    static validate = createValidator(ConfigDTO);

    static validateList = createArrayValidator(ConfigDTO);

    @Property()
    id: number;

    @Property({ maxLength: 255 })
    code: string;

    @Property({ nullable: true, maxLength: 2000 })
    value?: string;

    @Property({ maxLength: 255 })
    type: string;

    @Property({ maxLength: 255 })
    title: string;

    @Property({ nullable: true, maxLength: 2000 })
    description?: string;

    @Property({ nullable: true, maxLength: 2000 })
    help?: string;

    @Property()
    mutable: boolean;

    @Property({ maxLength: 255 })
    groupName: string;

    @Property({ nullable: true, maxLength: 255 })
    subGroupName?: string;

    @Property({ nullable: true })
    subGroupOrder?: number;
}

export interface ConfigUpdateRequest {
    id: number;

    value?: string;
}
