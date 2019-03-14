import { createValidator, Model, Property } from "@ozone/openapi-decorators";

import { UserReference } from "./DashboardDTO";


@Model({ name: "Preference" })
export class PreferenceDTO {

    static validate = createValidator(PreferenceDTO);

    @Property()
    id: number;

    @Property()
    namespace: string;

    @Property()
    path: string;

    @Property()
    value: string;

    @Property()
    user: UserReference;

}


@Model()
export class PreferenceGetResponse {

    static validate = createValidator(PreferenceGetResponse);

    @Property()
    success: boolean;

    @Property()
    results: number;

    @Property(() => PreferenceDTO)
    rows: PreferenceDTO[];

}


@Model()
export class PreferenceGetSingleResponse {

    static validate = createValidator(PreferenceGetSingleResponse);

	@Property()
	success: boolean;

	@Property({nullable: true})
	data: PreferenceDTO;

}

export interface PreferenceCreateRequest {
    id: number;
    namespace: string;
    path: string;
    value?: string;
    user: {userId: string}
}


@Model()
export class PreferenceCreateResponse {

    static validate = createValidator(PreferenceCreateResponse);

    @Property()
    success: boolean;

    @Property({nullable: true})
    data: PreferenceDTO;
}


export interface PreferenceUpdateRequest {
	id?: number;
	namespace: string;
	path: string;
	value: string;
	user?: {userId: string}
}


@Model()
export class PreferenceUpdateResponse {

    static validate = createValidator(PreferenceUpdateResponse);

    @Property()
    success: boolean;

    @Property({nullable: true})
    data: PreferenceDTO;

}


@Model()
export class PreferenceDeleteResponse {

    static validate = createValidator(PreferenceDeleteResponse);

    @Property()
    success: boolean;

    @Property({nullable: true})
    data: PreferenceDTO;

}
