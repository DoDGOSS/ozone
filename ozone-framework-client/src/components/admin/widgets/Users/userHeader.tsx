import * as React from "react";

export const UserHeader: React.StatelessComponent<{}> = () => {
    return (
            <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Groups</th>
                <th>Widgets</th>
                <th>Dashboards</th>
                <th>Last Login</th>
            </tr>
        );
}