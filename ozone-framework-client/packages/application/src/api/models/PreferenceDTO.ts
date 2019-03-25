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

    @Property({ nullable: true })
    preference?: PreferenceDTO;
}

export interface PreferenceCreateRequest {
    namespace: string;
    path: string;
    value?: string;
    userId?: number;
}

export interface PreferenceDeleteRequest {
    id: number;
    namespace: string;
    path: string;
    userId?: string;
}

export interface PreferenceUpdateRequest {
    id?: number;
    namespace: string;
    path: string;
    value: string;
    userId?: string;
}
