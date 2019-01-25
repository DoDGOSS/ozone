declare namespace OWF {

    export function ready(callback: () => void): void;

    namespace Preferences {

        interface UserPreference {
            id: number;
            namespace: string;
            path: string;
            user: {
                userId: string;
            };
            value: string;
        }

        interface UserPreferenceNotFound {
            preference: null;
            success: true;
        }

        type GetUserPreferenceOptions = {
            namespace: string,
            name: string,
            onSuccess: (preference: UserPreference | UserPreferenceNotFound) => void;
            onFailure: (error: any) => void;
        };

        export function getUserPreference(options: GetUserPreferenceOptions): void;

        type SetUserPreferenceOptions = {
            namespace: string,
            name: string,
            value: string,
            onSuccess: (preference: UserPreference) => void;
            onFailure: (error: any) => void;
        };

        export function setUserPreference(options: SetUserPreferenceOptions): void;

        type DeleteUserPreferenceOptions = {
            namespace: string,
            name: string,
            onSuccess: (result: any) => void;
            onFailure: (error: any) => void;
        };

        export function deleteUserPreference(options: DeleteUserPreferenceOptions): void;

    }

}
