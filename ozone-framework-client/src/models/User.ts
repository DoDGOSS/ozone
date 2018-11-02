export interface User {

    id: number;
    email: string;
    username: string;
    userRealName?: string;
    hasPWD: any;
    lastLogin: any;
    // TODO - Modify userRealName to displayName
    displayName: string;
    totalDashboards: number;
    totalGroups: number;
    totalStacks: number;
    totalWidgets: number;

}
