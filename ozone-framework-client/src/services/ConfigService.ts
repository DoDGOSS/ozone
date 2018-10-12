import axios from "axios";
import { injectable } from "../inject";

import { OzoneConfig } from "../api";


const DEFAULT_ROOT_URL = "http://localhost:8080";

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
