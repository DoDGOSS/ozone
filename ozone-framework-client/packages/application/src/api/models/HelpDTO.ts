import { IdDTO } from "./IdDTO";
import { createValidator } from "./validate";

export interface HelpDTO {
    text: string;
    path: string;
    leaf: boolean;
    children: any[] | null;
}

export interface HelpGetResponse {
    data: HelpDTO[];
}
