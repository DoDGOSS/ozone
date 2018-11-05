import * as React from "react";


// import { Column, Table } from "@blueprintjs/core";
import { WidgetContainer } from "../../../widget-dashboard/WidgetContainer";

import { User } from "../../../../models";
import { UserHeader } from "./userHeader";
import { UserRow } from "./userRow";


import { inject } from "../../../../inject";
import { AuthStore} from "../../../../stores";
// import { UserAPI } from "../../../../api/src/user";
import { userAPI } from "../../../../api/user";

interface State {
    users: User[];
}

export class UsersWidget extends React.Component<{}, State> {

    @inject(AuthStore)
    private authStore: AuthStore;

    // @inject(UserAPI)
    // private userAPI: UserAPI;

    constructor(props: any) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentWillMount() {
        this.authStore.check();
    }



    componentDidMount() {

        // Mock users
        userAPI.fetchUsers()
            .then((users) => {
                this.setState({ users });
                console.log(users);
            });
        // this.userAPI.getUserById(1)
        //     .then((response) => {
        //         console.log(response);
        //     });
        // this.userAPI.getUserById(1)
        //     .then((res) => {
        //         console.log(res);
        //     });
        // this.userAPI.getUserById(1)
        //     .then((res) => {
        //         console.log(res);
        //     });

    }

    render() {
        const title = 'User Admin Widget';

        return (
            <WidgetContainer title={title} body={UserTable(this.state.users)}/>
        );
    }

}


const UserTable = (users: User[]) => {
    return (
        <table>
            <thead>
            <UserHeader />
            </thead>
            <tbody>
            {
                users.map((user) =>
                    <UserRow
                        key={user.id}
                        user={user}
                    />
                )
            }
            </tbody>
        </table>
    );
};