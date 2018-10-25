import * as Ajv from "ajv";

import { ValidationError } from "../errors";
import { composeSchemas, JsonSchema } from "../schemas";

import { GROUP_SCHEMA, GROUP_SCHEMA_REF, GroupDTO } from "./schema";


export interface GroupGetResponse {
    results: number;
    data: GroupDTO[];
}

export const GROUP_RESPONSE_SCHEMA: JsonSchema<GroupGetResponse> = {
    type: "object",
    required: [
        "results",
        "data"
    ],
    additionalProperties: false,
    properties: {
        results: {
            type: "number"
        },
        data: {
            type: "array",
            items: {
                $ref: GROUP_SCHEMA_REF
            }
        }
    }
};

export function validateGroupResponse(data: any): GroupGetResponse {
    const ajv = new Ajv({ allErrors: true });

    const schema = composeSchemas(GROUP_RESPONSE_SCHEMA, { Group: GROUP_SCHEMA });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        throw new ValidationError("GroupGetResponse", validate.errors);
    }

    return data as GroupGetResponse;
}
