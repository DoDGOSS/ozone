export interface Group {
    id: number;

    groupName: string;
    userRealName: string;

    totalUsers: number;
    totalWidgets: number;
    totalDashboards: number;

    active: boolean;
    userManagement: boolean;
}
