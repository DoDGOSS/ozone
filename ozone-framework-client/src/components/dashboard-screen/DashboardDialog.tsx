import * as React from "react";
import { observer } from "mobx-react";

import { Button, Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";
import { DashboardAPI} from "../../api";

import { DashboardDTO } from "../../api/models/dashboard-dto";

export interface State {
  dashboards: DashboardDTO[];
}

@observer
export class DashboardDialog extends React.Component<{}, State> {

    @lazyInject(DashboardAPI)
    private dashboardAPI: DashboardAPI;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    constructor(props: any) {
        super(props);
        this.state = {dashboards: []};
      }

      componentDidMount() {
          this.getDashboards();
      }

    render() {
      const data = this.state.dashboards;
        return (
            <div>
                <Dialog className={this.mainStore.darkClass}
                        isOpen={this.mainStore.isDashboardDialogVisible}
                        onClose={this.mainStore.hideDashboardDialog}
                        title="Dashboards">

                    <div className={Classes.DIALOG_BODY} >

                    {data.map(Dash =>
                        <button className='layout' key={Dash.guid} value={Dash.name} >
                          <p>{Dash.name}</p>
                          <img src={Dash.iconImageUrl} />
                        </button>
                    )}

                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={()=>{this.mainStore.hideDashboardDialog();this.mainStore.showCreateDashboardDialog();}}
                                    icon="insert">
                                Create New
                            </Button>
                        </div>
                    </div>

                </Dialog>
            </div>
        );


        }
        private getDashboards = async () => {
            const response = await this.dashboardAPI.getDashboards();

            // TODO: Handle failed request
            if (response.status !== 200) return;

            this.setState({
                dashboards: response.data.data,
                // loading: false
            });
    }

}
