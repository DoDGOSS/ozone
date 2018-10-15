import axios from "axios";
import { injectable } from "../inject";

import { OzoneConfig } from "../api";

import { DEFAULT_ROOT_URL } from "../constants";


@injectable()
export class ConfigService {

    private readonly rootUrl: string;

    constructor(baseUrl: string = DEFAULT_ROOT_URL) {
        this.rootUrl = baseUrl;
    }

    async getConfig(): Promise<OzoneConfig> {
        const response = await axios.get(`${this.rootUrl}/api/v2/config`);
        return response.data;
    }

}
