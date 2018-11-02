import * as React from "react";

import { WidgetContainer } from "../../../widget-dashboard/WidgetContainer";
import { User } from "../../../../models";
import { userAPI } from "../../../../api/user";

interface State {
    users: User;
}

interface Props {

}

export class UsersWidget extends React.Component<Props, State> {


    constructor(props: any) {
        super(props);
        this.state = {
            users: []
        }
    }

    public componentDidMount() {
        userAPI.fetchUsers()
            .then((users) => {
                this.setState({ users });
            });
    }

    render() {
        const title = 'User Admin Widget';

        return (
            <WidgetContainer title={title} body="test"/>
        );
    }

};

const UserHeader = () => {
    return (
        <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Groups</th>
            <th>Widgets</th>
            <th>Dashboards</th>
            <th>Last Login</th>
        </tr>
    )
};

const UserRow = (user: User) => {
    return (
        <tr key={user.id}>
            <td>{user.displayName}</td>
            <td>{user.email}</td>
            <td>{user.totalGroups}</td>
            <td>{user.totalWidgets}</td>
            <td>{user.totalDashboards}</td>
            <td>{user.lastLogin}</td>
        </tr>
    )
};

const UserTable = () => {
    return (
        <div>
            <table>
                <thead>
                    {UserHeader()}
                </thead>
                <tbody>
                 {/*this.state.users.map(UserRow)*/}
                </tbody>
            </table>
        </div>
    )
};