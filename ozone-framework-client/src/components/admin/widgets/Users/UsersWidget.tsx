import * as React from "react";

import { Button, Intent } from "@blueprintjs/core";
import { AdminTable } from "../../table/AdminTable";


import { WidgetContainer } from "../../../widget-dashboard/WidgetContainer";
import { User } from "../../../../models";

import { lazyInject } from "../../../../inject";
import { UserAPI } from "../../../../api/src/user";

interface State {
    users: User[];
    loading: boolean;
    pageSize: number;
    columns: any;
}

// Todo
// Modify widget to take in widget values from administration menu and launch
// Pagination handling with client API
// Style

export class UsersWidget extends React.Component<{}, State> {

    @lazyInject(UserAPI)
    private userAPI: UserAPI;

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            pageSize: 5,
            columns: [
                {
                    Header: "Users",
                    columns: [
                        {
                            Header: "Name",
                            accessor: "userRealName"
                        },
                        {
                            Header: "Email",
                            accessor: "email"
                        },
                        {
                            Header: "Groups",
                            accessor: "totalGroups"
                        },
                        {
                            Header: "Widgets",
                            accessor: "totalWidgets"
                        },
                        {
                            Header: "Dashboards",
                            accessor: "totalDashboards"
                        },
                        {
                            Header: "Last Login",
                            accessor: "lastLogin"
                        }
                    ]
                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => (
                        <div>
                            <Button
                                text="Create"
                                intent={Intent.SUCCESS}
                                icon="add"
                                small={true}
                                onClick={() => console.log(row.original.id)}
                            />
                            <Button
                                text="Edit"
                                intent={Intent.PRIMARY}
                                icon="edit"
                                small={true}
                                onClick={() => this.getUserById(row.original.id)}
                            />
                            <Button
                                text="Delete"
                                intent={Intent.DANGER}
                                icon="trash"
                                disabled={true}
                                small={true}
                                // onClick={() => this.deleteUserById(row.original.id)}
                            />
                        </div>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.getUsers();
        this.getUserById(1);
    }

    render() {
        const title = 'User Admin Widget';

        return (
            <WidgetContainer
                title={title}
                body={
                    <AdminTable
                        data={this.state.users}
                        columns={this.state.columns}
                        loading={this.state.loading}
                        pageSize={this.state.pageSize}
                    />
                }
            />
        );
    }

    private getUsers = () => {
        this.userAPI.getUsers()
            .then((res) => this.setState({
                // TODO Modify to res.data
                users: res.data.data,
                loading: false
            }));
    }

    private getUserById = (id: number) => {
        this.userAPI.getUserById(id)
            .then ((res) => {
                console.log(res.data.data);
            });
    }

}