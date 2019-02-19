export interface User {
    id: number;

    username: string;
    userRealName: string;
    email: string;

    lastLogin: any | null;
    hasPWD: null;

    totalDashboards: number;
    totalStacks: number;
    totalGroups: number;
    totalWidgets: number;
}
