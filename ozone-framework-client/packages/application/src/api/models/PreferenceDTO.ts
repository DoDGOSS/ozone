import { createValidator, Model, Property } from "@ozone/openapi-decorators";

@Model({ name: "Preference" })
export class PreferenceDTO {

    static validate = createValidator(PreferenceDTO);
    //
    // @Property()
    // id: number;

    @Property()
    namespace: string;

    @Property()
    path: string;

    @Property()
    value: string;

}


@Model()
export class PreferenceGetResponse {

    static validate = createValidator(PreferenceGetResponse);

    @Property()
    results: number;

    @Property(() => PreferenceDTO)
    preference: PreferenceDTO[];

}


export interface PreferenceCreateRequest {
    namespace: string;
    path: string;
    value?: string;
}


@Model()
export class PreferenceCreateResponse {

    static validate = createValidator(PreferenceCreateResponse);

    @Property()
    success: boolean;

    @Property(() => PreferenceDTO)
    data: PreferenceDTO[];

}


export interface PreferenceUpdateRequest extends PreferenceCreateRequest {
}


@Model()
export class PreferenceUpdateResponse {

    static validate = createValidator(PreferenceUpdateResponse);

    @Property()
    success: boolean;

    @Property(() => PreferenceDTO)
    preference: PreferenceDTO[];

}


@Model()
export class PreferenceDeleteResponse {

    static validate = createValidator(PreferenceDeleteResponse);

    @Property()
    success: boolean;

    @Property(() => PreferenceDTO)
    data: PreferenceDTO;

}
