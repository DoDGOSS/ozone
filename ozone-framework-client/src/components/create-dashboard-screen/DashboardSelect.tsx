import * as React from "react";
import { observer } from "mobx-react";

import { lazyInject } from "../../inject";
import { DashboardAPI} from "../../api";

import { DashboardDTO } from "../../api/models/dashboard-dto";

import * as styles from "./CreateDashboardStyles.scss";

export interface State {
  dashboards: DashboardDTO[];
}

@observer
export class DashboardSelect extends React.Component<{}, State> {

    @lazyInject(DashboardAPI)
    private dashboardAPI: DashboardAPI;

    constructor(props: any) {
        super(props);
        this.state = {dashboards: []};
      }

      componentDidMount() {
          this.getDashboards();
      }

    render() {
      const Data = this.state.dashboards;

        return (
            <div className={styles.CopyStyles} data-element-id='DashboardSelect'>
                <select>
                    {Data.map(Dash =>
                        <option key={Dash.guid} value={Dash.name}>
                          {Dash.name}
                        </option>
                    )}
              </select>


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
