import { Gateway, getGateway, Response } from "../api/interfaces";

import { AuthUserDTO } from "../api/models/AuthUserDTO";

export class AuthService {
    private readonly gateway: Gateway;

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    login(username: string, password: string): Promise<Response<AuthUserDTO>> {
        return this.gateway.login(username, password);
    }

    check(): Promise<Response<AuthUserDTO>> {
        return this.gateway.getLoginStatus();
    }
}

export const authService = new AuthService();
