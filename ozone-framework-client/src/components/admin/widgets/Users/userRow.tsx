import * as React from "react";
import { User } from "../../../../models";

interface Props {
    user: User;
}

export const UserRow: React.StatelessComponent<Props> = ({user}) => {
    return (
        <tr key={user.id}>
            <td>{user.userRealName}</td>
            <td>{user.email}</td>
            <td>{user.totalGroups}</td>
            <td>{user.totalWidgets}</td>
            <td>{user.totalDashboards}</td>
            <td>{user.lastLogin}</td>
        </tr>
    );
};