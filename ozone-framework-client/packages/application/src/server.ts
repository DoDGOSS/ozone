import { trimEnd, trimStart } from "lodash";

import { env } from "./environment";

let _contextPath: string | undefined;
let _contextUrl: string | undefined;
let _serverHostUrl: string | undefined;
let _staticAssetPath: string | undefined;

export function serverHostUrl(): string {
    if (!_serverHostUrl) {
        _serverHostUrl = normalize(env().server.url);
    }
    return _serverHostUrl;
}

export function contextPath(): string {
    if (!_contextPath) {
        _contextPath = normalize(env().server.contextPath);
    }
    return _contextPath;
}

export function serverContextUrl(): string {
    if (!_contextUrl) {
        _contextUrl = normalize(`${serverHostUrl()}/${contextPath()}`);
    }
    return _contextUrl;
}

export function staticAssetPath(): string {
    if (!_staticAssetPath) {
        const assetPath = normalize(env().server.staticAssetPath);
        _staticAssetPath = normalize(`${contextPath()}/${assetPath}`);
    }
    return _staticAssetPath;
}

export function assetUrl(path?: string): string {
    if (!path) return "";

    if (path.startsWith("http")) {
        return path;
    }

    const _path = normalize(path);
    const _relativePath = normalize(`${staticAssetPath()}/${_path}`);
    return `/${_relativePath}`;
}

function normalize(value: string): string {
    return trimStart(trimEnd(value, "/"), "/");
}
