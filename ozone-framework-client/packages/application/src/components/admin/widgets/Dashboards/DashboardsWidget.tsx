import * as styles from "../Widgets.scss";

import * as React from "react";
import { Button, ButtonGroup, Divider, InputGroup, Intent } from "@blueprintjs/core";

// import { lazyInject } from "../../../../inject";
import { dashboardApi } from "../../../../api/clients/DashboardAPI";
import { DashboardDTO } from "../../../../api/models/DashboardDTO";

import { AdminTable } from "../../table/AdminTable";

export interface State {
    dashboards: DashboardDTO[];
    filtered: DashboardDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showCreate: boolean;
    showEditDashboard: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageDashboard: DashboardDTO | undefined;
    updatingDashboard?: any;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Error handling for form (if username exists etc)

enum DashboardWidgetSubSection {
    TABLE,
    CREATE,
    EDIT
}

export class DashboardsWidget extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            dashboards: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            showTable: true,
            showCreate: false,
            showEditDashboard: false,
            showDelete: false,
            confirmationMessage: "",
            manageDashboard: undefined,

            columns: [
                {
                    Header: "Dashboards",
                    columns: [
                        { Header: "Name", accessor: "name" }
                        // { Header: "Pages", accessor: "" }
                        // { Header: "Widgets", accessor: "" },
                        // { Header: "Groups", accessor: "" },
                        // { Header: "Users", accessor: "" }
                    ]
                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => (
                        <div>
                            <ButtonGroup>
                                <Button
                                    text="Edit"
                                    intent={Intent.PRIMARY}
                                    icon="edit"
                                    small={true}
                                    onClick={() => {
                                        this.showSubSection(DashboardWidgetSubSection.EDIT);
                                        this.setState({ updatingDashboard: row.original });
                                    }}
                                    data-element-id={"dashboard-admin-widget-edit-" + row.original}
                                />
                                <Divider />
                                <Button
                                    data-element-id={"dashboard-admin-widget-delete-" + row.original}
                                    text="Delete"
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    // onClick={() => this.deleteDashboard(row.original)}
                                />
                            </ButtonGroup>
                        </div>
                    )
                }
            ]
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getDashboards();
    }

    render() {
        const showTable = this.state.showTable;
        // const showCreate = this.state.showCreate;
        const showEditUser = this.state.showEditDashboard;

        let data = this.state.dashboards;
        const filter = this.state.filter.toLowerCase();

        if (filter) {
            data = data.filter((row) => {
                return row.name.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="dashboard-admin-widget-dialog">
                {showTable && (
                    <div className={styles.actionBar}>
                        <InputGroup
                            placeholder="Search..."
                            leftIcon="search"
                            value={this.state.filter}
                            onChange={(e: any) => this.setState({ filter: e.target.value })}
                            data-element-id="search-field"
                        />
                    </div>
                )}

                {showTable && (
                    <div className={styles.table}>
                        <AdminTable
                            data={data}
                            columns={this.state.columns}
                            loading={this.state.loading}
                            pageSize={this.state.pageSize}
                        />
                    </div>
                )}

                {/*showEditDashboard && (
                    <DashboardEditTabGroup
                        dashboard={this.state.updatingDashboard}
                        onUpdate={this.handleUpdate}
                        onBack={() => {
                            this.showSubSection(DashboardWidgetSubSection.TABLE);
                        }}
                    />
                )*/}

                {/* <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageUser}
                />  */}

                {/* this.state.alertIsOpen && (
                    <Alert cancelButtonText="Cancel"
                           confirmButtonText="Delete User"
                           icon="trash"
                           intent={Intent.DANGER}
                           isOpen={this.state.alertIsOpen}
                           className="delete-user-alert"
                           onCancel={this.handleAlertCancel}
                           onConfirm={() => this.handleAlertConfirm(this.state.deleteUser.id)}>
                        <p>Are you sure you want to delete <br/><b>User: {this.state.deleteUser.userRealName}</b>?</p>
                    </Alert>
                )} */}
            </div>
        );
    }

    private showSubSection(subSection: DashboardWidgetSubSection) {
        this.setState({
            showTable: subSection === DashboardWidgetSubSection.TABLE,
            showCreate: subSection === DashboardWidgetSubSection.CREATE
            // showEditDashboard: subSection === DashboardWidgetSubSection.EDIT
        });
    }

    private getDashboards = async () => {
        const response = await dashboardApi.getDashboards();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            dashboards: response.data.data,
            loading: false
        });
    };

    private handleUpdate(update?: any) {
        this.getDashboards();
    }

    /* private createDashboard = async (data: DashboardCreateRequest) => {
        const response = await this.userAPI.createDashboard(data);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.showSubSection(UserWidgetSubSection.TABLE);
        this.setState({ loading: true });
        this.getUsers();

        return true;
    };  */

    /* private updateDashboard = async (data: DashboardUpdateRequest) => {
         console.log('Submitting updated dashboard');
         const response = await this.dashboardAPI.updateDashboard(data);

         if (response.status !== 200) return false;

         this.toggleUpdate();
         this.setState({ loading: true });
         this.getDashboards();

         return true;
     } */

    /*  private deleteUser = async (user: UserDTO) => {
        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permenantly delete <strong>${user.username}</strong>`,
            manageUser: user
        });

        this.getUsers();

        return true;
    };

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageUser: undefined
        });

        const user: UserDTO = payload;

        const response = await this.userAPI.deleteUser(user.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getUsers();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageUser: undefined
        });
    }; */
}
