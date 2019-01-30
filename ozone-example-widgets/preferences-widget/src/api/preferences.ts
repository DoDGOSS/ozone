export function getUserPreference(namespace: string, path: string): Promise<OWF.Preferences.UserPreference> {
    return new Promise<OWF.Preferences.UserPreference>((resolve, reject) => {
        OWF.Preferences.getUserPreference({
            namespace,
            name: path,
            onSuccess: (result) => {
                if (result.hasOwnProperty("preference")) {
                    reject(`Not Found: ${namespace}/${path}`);
                }
                resolve(result as OWF.Preferences.UserPreference);
            },
            onFailure: reject
        });
    });
}

export function setUserPreference(namespace: string, path: string, value: string): Promise<OWF.Preferences.UserPreference> {
    return new Promise<OWF.Preferences.UserPreference>((resolve, reject) => {
        OWF.Preferences.setUserPreference({
            namespace,
            name: path,
            value,
            onSuccess: resolve,
            onFailure: reject
        });
    });
}

export function deleteUserPreference(namespace: string, path: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        OWF.Preferences.deleteUserPreference({
            namespace,
            name: path,
            onSuccess: resolve,
            onFailure: reject
        });
    });
}
