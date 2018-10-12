export interface OzoneConfig {

    user: User;

}


export interface User {

    id: number;

    displayName: string;
    userRealName: string;
    email: string;

    isAdmin: boolean;

    groups: any[];

    prevLogin: string;
    prettyPrevLogin: string;

}
